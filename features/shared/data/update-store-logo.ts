import { StoreUploadResponse } from "@/features/shared/types/types";
import { prisma } from "@/utils/prisma";

export async function updateStoreLogo(storeId: number, logoUrl: string): Promise<StoreUploadResponse> {
    return await prisma.store.update({
        where: { id: storeId },
        data: {
            logo: logoUrl,
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