/* import { prisma } from "@/utils/prisma"

export async function findUserComments(userId: number, limit: number) {
    return prisma.product_comments.findMany({
        where: { user_id: userId, is_active: true },
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