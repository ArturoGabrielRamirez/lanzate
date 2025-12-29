"use server"

import { actionWrapper } from "@/features/global/utils"
import { prisma } from "@/utils/prisma"

export async function getStoreIdBySubdomainData({ subdomain }: { subdomain: string }) {
    return actionWrapper(async () => {
        const store = await prisma.store.findUnique({
            where: {
                subdomain: subdomain
            },
            select: {
                id: true
            }
        })

        return {
            payload: store?.id || null,
            hasError: false,
            message: "ID de la tienda recuperada exitosamente"
        }
    })
}
