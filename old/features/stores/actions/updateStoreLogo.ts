"use server"

import { prisma } from "@/utils/prisma"
import { actionWrapper } from "@/utils/lib"

export async function updateStoreLogo(storeId: number, logoUrl: string) {
    return actionWrapper(async () => {
        const updatedStore = await prisma.store.update({
            where: { id: storeId },
            data: { logo: logoUrl }
        })

        return {
            error: false,
            message: "Logo actualizado correctamente",
            payload: updatedStore
        }
    })
}