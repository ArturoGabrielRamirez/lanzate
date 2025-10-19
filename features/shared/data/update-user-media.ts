import { prisma } from "@/utils/prisma";

export async function updateUserMedia(
    userId: number,
    type: 'avatar' | 'banner',
    newValue: string | null
) {
    return await prisma.user.update({
        where: { id: userId },
        data: {
            [type]: newValue,
            updated_at: new Date()
        },
        select: {
            id: true,
            username: true,
            avatar: true,
            banner: true,
            first_name: true,
            last_name: true
        }
    })
}