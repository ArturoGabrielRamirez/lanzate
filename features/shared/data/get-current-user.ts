import { UserUploadResponse } from "@/features/shared/types/types";
import { prisma } from "@/utils/prisma";

export async function getCurrentUser(userId: number): Promise<Pick<UserUploadResponse, 'avatar' | 'banner'> | null> {
    return await prisma.user.findUnique({
        where: { id: userId },
        select: { avatar: true, banner: true }
    })
}