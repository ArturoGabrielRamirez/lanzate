import { UserUploadResponse } from "@/features/global/types/media";
import { prisma } from "@/utils/prisma";

export async function updateUserBannerData(userId: number, bannerUrl: string | null): Promise<UserUploadResponse> {
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