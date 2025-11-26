import { ProductMediaResponse, UploadType } from "@/features/global/types/media"
import { getMediaType } from "@/features/global/utils/media/get-media-type"
import { prisma } from "@/utils/prisma"

export async function createProductMediaData(
    productId: number,
    variantId: number | undefined,
    url: string,
    file: File,
    type: UploadType,
    sortOrder?: number // ✅ Nuevo parámetro opcional
): Promise<ProductMediaResponse> {
    const mediaType = getMediaType(type, file.type)

    if (!mediaType) {
        throw new Error('Tipo de multimédia inválido')
    }

    let finalSortOrder = sortOrder
    if (finalSortOrder === undefined) {
        const lastMedia = await prisma.productMedia.findFirst({
            where: { product_id: productId },
            orderBy: { sort_order: 'desc' }
        })
        finalSortOrder = (lastMedia?.sort_order || 0) + 1
    }

    console.log('Creating ProductMedia:', {
        productId,
        mediaType,
        sortOrder: finalSortOrder,
        url
    })

    return await prisma.productMedia.create({
        data: {
            product_id: productId,
            product_variant_id: variantId,
            type: mediaType,
            url: url,
            alt_text: file.name,
            sort_order: finalSortOrder
        },
        select: {
            id: true,
            product_id: true,
            type: true,
            url: true,
            alt_text: true,
            sort_order: true,
            created_at: true
        }
    })
}