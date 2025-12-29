import { UserUploadResponse } from "@/features/global/types/media";
import { prisma } from "@/utils/prisma";

export async function getCurrentUserMediaData(userId: number): Promise<Pick<UserUploadResponse, 'avatar' | 'banner'> | null> {
    return await prisma.user.findUnique({
        where: { id: userId },
        select: { avatar: true, banner: true }
    })
}