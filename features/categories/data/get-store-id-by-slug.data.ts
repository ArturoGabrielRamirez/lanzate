"use server"

import { GetStoreIdBySlugAction } from "@/features/categories/types"
import { actionWrapper } from "@/features/global/utils"
import { prisma } from "@/utils/prisma"

export async function getStoreIdBySlugData({ slug }: GetStoreIdBySlugAction) {
    return actionWrapper(async () => {
        const store = await prisma.store.findUnique({
            where: {
                slug: slug
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