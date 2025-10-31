import { prisma } from "@/utils/prisma";

export async function deleteProductMediaData(mediaId: number) {
    return await prisma.productMedia.delete({
        where: { id: mediaId }
    })
}