"use server"

import { actionWrapper } from "@/features/global/utils"
import { prisma } from "@/utils/prisma"

export async function updateStoreBannerAction(storeId: number, bannerUrl: string) {
    return actionWrapper(async () => {
        const updatedStore = await prisma.store.update({
            where: { id: storeId },
            data: { banner: bannerUrl }
        })

        return {
            hasError: false,
            message: "Banner actualizado correctamente",
            payload: updatedStore
        }
    })
}


