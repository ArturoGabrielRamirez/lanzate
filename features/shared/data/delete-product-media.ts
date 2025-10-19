import { prisma } from "@/utils/prisma";

export async function deleteProductMedia(mediaId: number) {
    return await prisma.productMedia.delete({
        where: { id: mediaId }
    })
}