import { prisma } from "@/utils/prisma";

export async function getProductMediaById(mediaId: number) {
    return await prisma.productMedia.findUnique({
        where: { id: mediaId },
        include: {
            product: {
                select: {
                    owner_id: true
                }
            }
        }
    })
}