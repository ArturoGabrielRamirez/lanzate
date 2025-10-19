/* import { prisma } from "@/utils/prisma";

export async function getUsersBatch(userIds: number[]) {
    return prisma.user.findMany({
        where: {
            id: { in: userIds }
        },
        select: {
            id: true,
            username: true,
            first_name: true,
            last_name: true,
            avatar: true,
            profile_is_public: true,
            _count: {
                select: {
                    user_follows_following: true
                }
            }
        }
    })
} */