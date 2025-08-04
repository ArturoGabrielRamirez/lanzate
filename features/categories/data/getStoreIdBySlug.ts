"use server"

import { prisma } from "@/utils/prisma"
import { actionWrapper } from "@/utils/lib"

export async function getStoreIdBySlug(slug: string) {
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
            error: null,
            message: "Store ID obtenido exitosamente"
        }
    })
} 