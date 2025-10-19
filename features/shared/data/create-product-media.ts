
import { ProductMediaResponse, UploadType } from "@/features/shared/types/types"
import { prisma } from "@/utils/prisma"
import { getMediaType } from "../utils/get-media-type"

export async function createProductMedia(
    productId: number,
    url: string,
    file: File,
    type: UploadType
): Promise<ProductMediaResponse> {
    const mediaType = getMediaType(type, file.type)

    if (!mediaType) {
        throw new Error('Tipo de media no válido')
    }

    const lastMedia = await prisma.productMedia.findFirst({
        where: { product_id: productId },
        orderBy: { sort_order: 'desc' }
    })

    return await prisma.productMedia.create({
        data: {
            product_id: productId,
            type: mediaType,
            url: url,
            alt_text: file.name,
            sort_order: (lastMedia?.sort_order || 0) + 1
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