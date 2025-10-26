import { prisma } from "@/utils/prisma";
import { UserUploadResponse } from "@/features/global/types/media";

export async function updateUserBanner(userId: number, bannerUrl: string | null): Promise<UserUploadResponse> {
    return await prisma.user.update({
        where: { id: userId },
        data: {
            banner: bannerUrl,
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