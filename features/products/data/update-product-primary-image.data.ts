import { prisma } from "@/utils/prisma";

export async function updateProductPrimaryImageData(
    productId: number,
    imageUrl: string,
    mediaId: number
): Promise<void> {
    await prisma.product.update({
        where: { id: productId },
        data: {
            image: imageUrl,
            primary_media_id: mediaId,
            updated_at: new Date()
        }
    })
}