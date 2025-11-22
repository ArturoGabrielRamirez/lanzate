"use server"

import { prisma } from "@/utils/prisma"

export async function selectStoreBalanceBySlugData(slug: string) {
    const store = await prisma.store.findUnique({
        where: {
            slug: slug
        },
        select: {
            balance: true
        }
    })

    return {
        message: "Balance de la tienda recuperado con éxito desde la base de datos",
        payload: store,
        hasError: false
    }
}