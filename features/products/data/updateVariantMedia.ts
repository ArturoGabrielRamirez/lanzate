"use server"

import { prisma } from "@/utils/prisma"
import { actionWrapper } from "@/utils/lib"
import { uploadProductImage } from "@/features/products/actions/uploadProductImage"
import { MediaType } from "@prisma/client"

type UpdateVariantMediaPayload = {
    primary_media_id?: number | null
    files?: File[]
}

export async function updateVariantMedia(variantId: number, data: UpdateVariantMediaPayload) {
    return actionWrapper(async () => {
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
            const uploaded = await uploadProductImage(file, variantWithProduct.product.store_id)

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

            return { error: false, message: "Imagen subida y asignada correctamente", payload: updatedVariant }
        }

        // Si no hay archivos nuevos pero hay un primary_media_id, actualizar solo eso
        if (data.primary_media_id !== undefined) {
            const variant = await prisma.productVariant.update({
                where: { id: variantId },
                data: {
                    primary_media_id: data.primary_media_id
                }
            })

            return {
                error: false,
                message: "Imagen principal actualizada correctamente",
                payload: variant
            }
        }

        throw new Error("No se proporcionaron cambios para actualizar")
    })
}
