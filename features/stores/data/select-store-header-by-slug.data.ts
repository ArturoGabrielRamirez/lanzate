"use server"

import { prisma } from "@/utils/prisma"

export async function selectStoreHeaderBySlugData(slug: string) {
    const store = await prisma.store.findUnique({
        where: {
            slug: slug
        },
        select: {
            id: true,
            name: true,
            description: true,
            logo: true,
            banner: true,
            balance: {
                select: {
                    current_balance: true
                }
            }
        }
    })

    if (!store) {
        throw new Error("Store not found")
    }

    return {
        message: "Store header fetched successfully from db",
        payload: store,
        hasError: false
    }
} 