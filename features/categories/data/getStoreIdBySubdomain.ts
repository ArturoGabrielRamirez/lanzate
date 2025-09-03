"use server"

import { prisma } from "@/utils/prisma"
import { actionWrapper } from "@/utils/lib"

export async function getStoreIdBySubdomain(subdomain: string) {
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
            error: false,
            message: "Store ID obtenido exitosamente"
        }
    })
}
