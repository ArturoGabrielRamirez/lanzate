"use server"

import { actionWrapper } from "@/features/global/utils"
import { prisma } from "@/utils/prisma"

export async function updateStoreLogoAction(storeId: number, logoUrl: string) {
    return actionWrapper(async () => {
        const updatedStore = await prisma.store.update({
            where: { id: storeId },
            data: { logo: logoUrl }
        })

        return {
            hasError: false,
            message: "Logo actualizado correctamente",
            payload: updatedStore
        }
    })
}