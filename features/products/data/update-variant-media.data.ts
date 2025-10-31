"use server"

import { MediaType } from "@prisma/client"
import { revalidatePath } from "next/cache"

import { uploadProductImageData } from "@/features/products/data/upload-product-image.data"
import { UpdateVariantMediaPayload } from "@/features/products/types"
import { prisma } from "@/utils/prisma"

export async function updateVariantMediaData(variantId: number, data: UpdateVariantMediaPayload) {
    // Si hay archivos nuevos, subirlos primero
    if (data.files && data.files.length > 0) {
        const file = data.files[0] // Solo tomamos el primero ya que las variantes solo tienen una imagen

        // Obtener la variante y su producto para conocer el store_id
        const variantWithProduct = await prisma.productVariant.findUnique({
            where: { id: variantId },
            include: { product: { select: { id: true, store_id: true } } }
        })

        if (!variantWithProduct || !variantWithProduct.product) {
            throw new Error("Variante o producto no encontrado")
        }

        // Subir imagen a Supabase Storage usando el flujo existente
        const uploaded = await uploadProductImageData(file, variantWithProduct.product.store_id)

        // Crear el registro de media en el modelo correcto y asignarlo a la variante
        const createdMedia = await prisma.productMedia.create({
            data: {
                product_id: variantWithProduct.product.id,
                product_variant_id: variantId,
                url: uploaded.url,
                type: MediaType.IMAGE,
            }
        })

        // Actualizar la variante con el nuevo primary_media
        const updatedVariant = await prisma.productVariant.update({
            where: { id: variantId },
            data: { primary_media_id: createdMedia.id }
        })

        const slug = variantWithProduct.product ? (await prisma.store.findFirst({ where: { id: variantWithProduct.product.store_id }, select: { slug: true } }))?.slug : undefined
        if (slug) revalidatePath(`/stores/${slug}/products/${variantWithProduct.product.id}/${variantId}`, "page")

        return { hasError: false, message: "Imagen subida y asignada correctamente", payload: updatedVariant }
    }

    // Si no hay archivos nuevos pero hay un primary_media_id, actualizar solo eso
    if (data.primary_media_id !== undefined) {
        const variant = await prisma.productVariant.update({
            where: { id: variantId },
            data: {
                primary_media_id: data.primary_media_id
            }
        })

        const ref = await prisma.productVariant.findUnique({
            where: { id: variantId },
            select: { product: { select: { id: true, store: { select: { slug: true } } } } }
        })
        if (ref?.product?.store?.slug && ref.product.id) {
            revalidatePath(`/stores/${ref.product.store.slug}/products/${ref.product.id}/${variantId}`, "page")
        }

        return {
            hasError: false,
            message: "Imagen principal actualizada correctamente",
            payload: variant
        }
    }

    throw new Error("No se proporcionaron cambios para actualizar")
}
