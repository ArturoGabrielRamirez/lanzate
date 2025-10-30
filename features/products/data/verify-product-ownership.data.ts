import { prisma } from "@/utils/prisma";

export async function verifyProductOwnershipData(productId: number, userId: number) {
    const product = await prisma.product.findFirst({
        where: {
            id: productId,
            owner_id: userId
        },
        select: {
            id: true,
            name: true,
            image: true,
            primary_media_id: true,
            owner_id: true,
            store_id: true
        }
    })

    return product
}