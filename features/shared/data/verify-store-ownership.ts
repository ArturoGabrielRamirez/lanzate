import { prisma } from "@/utils/prisma";

export async function verifyStoreOwnership(storeId: number, userId: number) {
    const store = await prisma.store.findFirst({
        where: {
            id: storeId,
            user_id: userId
        },
        select: {
            id: true,
            name: true,
            logo: true,
            banner: true,
            user_id: true,
            slug: true
        }
    })

    return store
}