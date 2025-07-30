"use server"

import { PrismaClient } from '@prisma/client'
import { formatErrorResponse } from "@/utils/lib"

type StoreHeader = {
    name: string
    description: string | null
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
    try {
        const client = new PrismaClient()

        const store = await client.store.findUnique({
            where: {
                slug: slug
            },
            select: {
                name: true,
                description: true,
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

    } catch (error) {
        return formatErrorResponse("Error fetching store header from db", error, null)
    }
} 