/* import { prisma } from "@/utils/prisma"

export async function findUserById(userId: number) {
    return prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            profile_is_public: true,
            created_at: true,
            username: true
        }
    })
} */