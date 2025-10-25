"use server"

import { GetStoreIdBySubdomainAction } from "@/features/categories/types"
import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export async function getStoreIdBySubdomainData({ subdomain }: GetStoreIdBySubdomainAction) {
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
