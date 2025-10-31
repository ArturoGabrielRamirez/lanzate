"use server"

import randomstring from "randomstring"

import { UnifiedArgs } from "@/features/products/types"
import { generateSlug } from "@/features/products/utils"
import { prisma } from "@/utils/prisma"
import { createServerSideClient } from "@/utils/supabase/server"

import type { MediaType, LengthUnit, WeightUnit } from "@prisma/client"

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
        if (!store) throw new Error("Store not found")
        const branches = await tx.branch.findMany({ where: { store_id: store.id } })
        if (!branches || branches.length === 0) throw new Error("No branches found for store")

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

        const product = await tx.product.create({
            data: {
                name: args.form.name,
                description: (args.form.description as string | undefined) ?? null,
                price: args.form.price,
                // product-level stock will be derived after creating variant stocks
                stock: 0,
                store_id: store.id,
                owner_id: args.userId,
                slug,
                sku: skuBase,
                is_active: args.settings?.isActive ?? true,
                is_featured: args.settings?.isFeatured ?? false,
                is_published: args.settings?.isPublished ?? true,
                // dimensions
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

        let derivedTotalStock = 0

        for (let i = 0; i < effectiveVariants.length; i++) {
            const v = effectiveVariants[i]
            // Initial stock: 0 for each branch
            const initialStocks = branches.map((b) => ({ branch_id: b.id, quantity: 0 }))

            // optional color lookup/creation: link by name if exists
            let colorId: number | null = null
            if (v.color?.name) {
                let existing = await tx.color.findFirst({ where: { store_id: store.id, name: v.color.name } })
                if (!existing) {
                    // store rgba as JSON array
                    existing = await tx.color.create({ data: { store_id: store.id, name: v.color.name, rgba: JSON.stringify(v.color.rgba) as unknown as object } })
                }
                colorId = existing.id
            }

            await tx.productVariant.create({
                data: {
                    product_id: product.id,
                    // Datos heredados del producto
                   /*  name: product.name + (v.size ? ` - ${v.size}` : '') + (v.measure ? ` - ${v.measure}` : '') + (v.color?.name ? ` - ${v.color.name}` : ''), */
                    description: product.description,
                    price: product.price,
                    barcode: product.barcode,
                    is_active: product.is_active,
                    sku: skuBase + "-" + randomstring.generate(4),
                    // Configuraciones de variante
                    is_visible: true,
                    available_for_sale: true,
                    requires_shipping: true,
                    // Dimensiones heredadas del producto
                    ...(product.height ? { height: product.height, height_unit: product.height_unit } : {}),
                    ...(product.width ? { width: product.width, width_unit: product.width_unit } : {}),
                    ...(product.depth ? { depth: product.depth, depth_unit: product.depth_unit } : {}),
                    ...(product.diameter ? { diameter: product.diameter, diameter_unit: product.diameter_unit } : {}),
                    ...(product.weight ? { weight: product.weight, weight_unit: product.weight_unit } : {}),
                    // Detalles específicos de la variante
                  /*   size: v.size ?? null,
                    measure: v.measure ?? null, */
                    color_id: colorId,
                    // Precios adicionales
                    compare_price: null,
                    cost_price: null,
                    wholesale_price: null,
                    min_wholesale_qty: null,
                    // Límites y alertas
                    low_stock_alert: null,
                    max_per_order: null,
                    // Crear el stock inicial
                    stocks: { create: initialStocks }
                }
            })
            // accumulate stock after variant creation if needed later
            const sum = initialStocks.reduce((acc, s) => acc + s.quantity, 0)
            derivedTotalStock += sum
        }

        // Update product.stock as derived sum of variant stocks
        if (derivedTotalStock !== product.stock) {
            await tx.product.update({ where: { id: product.id }, data: { stock: derivedTotalStock } })
        }

        return product
    })

    return { hasError: false, message: "ok", payload: result }
}


