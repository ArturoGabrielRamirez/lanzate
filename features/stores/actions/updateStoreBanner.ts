"use server"

import { prisma } from "@/utils/prisma"
import { actionWrapper } from "@/utils/lib"

export async function updateStoreBanner(storeId: number, bannerUrl: string) {
    return actionWrapper(async () => {
        const updatedStore = await prisma.store.update({
            where: { id: storeId },
            data: { banner: bannerUrl }
        })

        return {
            error: false,
            message: "Banner actualizado correctamente",
            payload: updatedStore
        }
    })
}


