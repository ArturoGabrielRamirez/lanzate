import { prisma } from "@/utils/prisma";
import { UserUploadResponse } from "@/features/shared/types/types";

export async function updateUserAvatar(userId: number, avatarUrl: string | null): Promise<UserUploadResponse> {
    return await prisma.user.update({
        where: { id: userId },
        data: {
            avatar: avatarUrl,
            updated_at: new Date()
        },
        select: {
            id: true,
            username: true,
            avatar: true,
            banner: true
        }
    })
}