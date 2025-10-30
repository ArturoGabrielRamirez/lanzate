import { UserUploadResponse } from "@/features/global/types/media";
import { prisma } from "@/utils/prisma";

export async function updateUserAvatarData(userId: number, avatarUrl: string | null): Promise<UserUploadResponse> {
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