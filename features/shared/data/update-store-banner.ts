import { StoreUploadResponse } from "@/features/shared/types/types";
import { prisma } from "@/utils/prisma";

export async function updateStoreBanner(storeId: number, bannerUrl: string): Promise<StoreUploadResponse> {
    return await prisma.store.update({
        where: { id: storeId },
        data: {
            banner: bannerUrl,
            updated_at: new Date()
        },
        select: {
            id: true,
            name: true,
            logo: true,
            banner: true,
            slug: true
        }
    })
}