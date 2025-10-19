/* import { prisma } from "@/utils/prisma"

export async function findUserOrders(userId: number, limit: number) {
    return prisma.order.findMany({
        where: {
            id: userId,
            status: 'COMPLETED'
        },
        include: {
            store: {
                select: {
                    id: true,
                    name: true,
                    logo: true,
                    slug: true
                }
            }
        },
        orderBy: { created_at: 'desc' },
        take: limit
    })
} */