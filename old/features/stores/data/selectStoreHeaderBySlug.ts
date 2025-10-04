"use server"

/* import { PrismaClient } from '@prisma/client' */
/* import { actionWrapper } from "@/utils/lib" */
import { prisma } from "@/utils/prisma"

type StoreHeader = {
    id: number
    name: string
    description: string | null
    logo: string | null
    banner: string | null
    balance: {
        current_balance: number
    } | null
}

type SelectStoreHeaderBySlugReturn = {
    message: string
    payload: StoreHeader | null
    error: boolean
}

export async function selectStoreHeaderBySlug(slug: string): Promise<SelectStoreHeaderBySlugReturn> {
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
        error: false
    }
} 