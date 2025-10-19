/* import { prisma } from "@/utils/prisma"

export async function findUserFollows(userId: number, limit: number) {
    return prisma.userFollow.findMany({
        where: { follower_id: userId },
        include: {
            following: {
                select: {
                    id: true,
                    username: true,
                    first_name: true,
                    last_name: true,
                    avatar: true
                }
            }
        },
        orderBy: { created_at: 'desc' },
        take: limit
    })
} */