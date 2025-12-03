"use server"

import { ProductType, ProductStatus, type MediaType, type LengthUnit, type WeightUnit } from "@prisma/client"
import randomstring from "randomstring"

import { UnifiedArgs } from "@/features/products/types"
import { generateSlug } from "@/features/products/utils"
import { prisma } from "@/utils/prisma"
import { createServerSideClient } from "@/utils/supabase/server"

export async function insertUnifiedProductData(args: UnifiedArgs) {
    const supabase = createServerSideClient()

    // PREP: Upload media first, outside of the DB transaction to avoid timeouts
    const files = args.media?.files ?? []
    const uploadedUrls: string[] = []
    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const f = files[i]
            const { data: existing } = supabase.storage.from("product-images").getPublicUrl(f.name)
            let url = existing?.publicUrl
            if (!url) {
                const up = await supabase.storage.from("product-images").upload(f.name, f)
                if (up.error) throw new Error(up.error.message)
                const { data: after } = supabase.storage.from("product-images").getPublicUrl(up.data.path)
                url = after.publicUrl
            }
            uploadedUrls.push(url)
        }
    }

    const result = await prisma.$transaction(async (tx) => {
        // 1) Validate store and main branch
        const store = await tx.store.findUnique({ where: { id: args.targetStoreId } })
        if (!store) throw new Error("Tienda no encontrada")
        
        // Find main branch (is_main: true)
        const mainBranch = await tx.branch.findFirst({
            where: {
                store_id: store.id,
                is_main: true
            }
        })
        if (!mainBranch) throw new Error("Sucursal principal no encontrada")
        
        const branches = await tx.branch.findMany({ where: { store_id: store.id } })
        if (!branches || branches.length === 0) throw new Error("No se encontraron sucursales para la tienda")

        // 2) Create product
        // Generar un slug base y verificar si existe
        const baseSlug = (args.form.slug && args.form.slug.length > 0)
            ? args.form.slug
            : args.form.name.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')

        // Verificar si el slug existe y agregar sufijo si es necesario
        const existingProduct = await tx.product.findUnique({ where: { slug: baseSlug } })
        const slug = generateSlug(baseSlug, existingProduct ? baseSlug : null)

        const skuBase = Math.random().toString(36).slice(2, 10)

        // Resolve categories from form or section and filter invalid values
        const categoryIds: number[] = ((args.form.categories && args.form.categories.length > 0)
            ? args.form.categories
            : (args.categories?.categories ?? [])
        ).map((c) => Number.parseInt(String(c.value), 10)).filter((id) => Number.isFinite(id))

        // Extract additional fields from args (extend UnifiedArgs if needed)
        const productType = (args.form.type as ProductType | undefined) ?? ProductType.PHYSICAL
        const productStatus = ProductStatus.ACTIVE // Default to ACTIVE, can be extended later
        const brand = args.form.brand as string | undefined
        const tags = (args.form.tags as string[] | undefined) ?? []
        const seoTitle = undefined // Can be extended later
        const seoDescription = undefined // Can be extended later
        const isNew = false // Can be extended later
        const isOnSale = false // Can be extended later
        const allowPromotions = true // Default
        const freeShipping = false // Default

        const product = await tx.product.create({
            data: {
                name: args.form.name,
                description: (args.form.description as string | undefined) ?? null,
                store_id: store.id,
                owner_id: args.userId,
                slug,
                // TYPE
                type: productType,
                // ORGANIZATION
                brand: brand ?? null,
                tags: tags,
                // VISIBILITY & PROMOTION
                status: productStatus,
                is_featured: args.settings?.isFeatured ?? false,
                is_new: isNew,
                is_on_sale: isOnSale,
                allow_promotions: allowPromotions,
                // GLOBAL SHIPPING CONFIG
                free_shipping: freeShipping,
                // SEO
                seo_title: seoTitle ?? null,
                seo_description: seoDescription ?? null,
                // categories (optional)
                ...(categoryIds.length > 0 ? {
                    categories: {
                        connect: categoryIds.map((id) => ({ id }))
                    }
                } : {})
            }
        })

        // 3) Create ProductMedia with pre-uploaded URLs
        if (uploadedUrls.length > 0) {
            for (let i = 0; i < uploadedUrls.length; i++) {
                await tx.productMedia.create({
                    data: {
                        product_id: product.id,
                        type: "IMAGE" as MediaType,
                        url: uploadedUrls[i],
                        sort_order: i,
                    }
                })
            }
            const pIndex = args.media?.primaryIndex ?? null
            if (pIndex !== null && pIndex >= 0) {
                const primary = await tx.productMedia.findFirst({ where: { product_id: product.id, sort_order: pIndex } })
                if (primary) await tx.product.update({ data: { primary_media_id: primary.id }, where: { id: product.id } })
            }
        }

        // 4) Create variants
        const variantsInput = args.variants ?? []
        const effectiveVariants = variantsInput.length > 0
            ? variantsInput
            : [{ id: "one-one", size: undefined as string | undefined, measure: undefined as string | undefined, color: undefined }]

        const stockPerVariant = args.form.stock ?? 0

        for (let i = 0; i < effectiveVariants.length; i++) {
            const v = effectiveVariants[i]
            
            // Get stock for this variant (if variants have individual stock, use that; otherwise divide equally)
            // For single variant, assign all stock to it
            const variantStock = (v as { stock?: number }).stock ?? (effectiveVariants.length === 1 ? stockPerVariant : 0)
            
            // Create stock entries: all stock goes to main branch, others get 0
            const initialStocks = branches.map((b) => ({ 
                branch_id: b.id, 
                quantity: b.id === mainBranch.id ? variantStock : 0 
            }))

            // Extract dimensions from args.dimensions
            const variantDimensions = {
                height: (args.dimensions?.height as number | undefined) ?? null,
                height_unit: (args.dimensions?.heightUnit as LengthUnit | undefined) ?? null,
                width: (args.dimensions?.width as number | undefined) ?? null,
                width_unit: (args.dimensions?.widthUnit as LengthUnit | undefined) ?? null,
                depth: (args.dimensions?.depth as number | undefined) ?? null,
                depth_unit: (args.dimensions?.depthUnit as LengthUnit | undefined) ?? null,
                diameter: (args.dimensions?.diameter as number | undefined) ?? null,
                diameter_unit: (args.dimensions?.diameterUnit as LengthUnit | undefined) ?? null,
                weight: (args.dimensions?.weight as number | undefined) ?? null,
                weight_unit: (args.dimensions?.weightUnit as WeightUnit | undefined) ?? null,
            }

            await tx.productVariant.create({
                data: {
                    product_id: product.id,
                    // IDENTITY
                    sku: skuBase + "-" + randomstring.generate(4),
                    barcode: null,
                    // PRICING
                    price: args.form.price,
                    promotional_price: null,
                    cost_price: null,
                    show_price: true,
                    // INVENTORY SETTINGS
                    stock_unlimited: false,
                    track_stock: true,
                    // STATE
                    is_active: args.settings?.isActive ?? true,
                    is_default: effectiveVariants.length === 1,
                    // PHYSICAL PROPERTIES (from dimensions)
                    height: variantDimensions.height,
                    height_unit: variantDimensions.height_unit,
                    width: variantDimensions.width,
                    width_unit: variantDimensions.width_unit,
                    depth: variantDimensions.depth,
                    depth_unit: variantDimensions.depth_unit,
                    diameter: variantDimensions.diameter,
                    diameter_unit: variantDimensions.diameter_unit,
                    weight: variantDimensions.weight,
                    weight_unit: variantDimensions.weight_unit,
                    // Create stock items (all stock goes to main branch)
                    stock_items: { create: initialStocks }
                }
            })
        }

        // Note: Product model no longer has stock field - stock is managed at variant level

        return product
    })

    return { hasError: false, message: "ok", payload: result }
}


