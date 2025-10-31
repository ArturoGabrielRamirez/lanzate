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
        message: "Store balance fetched successfully from db",
        payload: store,
        hasError: false
    }
}