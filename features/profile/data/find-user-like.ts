/* import { prisma } from "@/utils/prisma"

export async function findUserLikes(userId: number, limit: number) {
    return prisma.product_likes.findMany({
        where: { user_id: userId },
        include: {
            products: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    slug: true
                }
            }
        },
        orderBy: { created_at: 'desc' },
        take: limit
    })
} */