import { prisma } from "@/utils/prisma"

export async function getUserMediaByType(userId: number, type: 'avatar' | 'banner') {
    return await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            username: true,
            avatar: true,
            banner: true
        }
    })
}