"use server"

import { PrismaClient, Store, Branch } from "@/prisma/generated/prisma"
import { formatErrorResponse } from "@/utils/lib"

type SelectStoreBySlugReturn = {
    message: string
    payload: Store & { branches: Branch[] } | null
    error: boolean
}

export async function selectStoreBySlug(slug: string): Promise<SelectStoreBySlugReturn> {
    try {

        const client = new PrismaClient()

        const store = await client.store.findUnique({
            where: {
                slug: slug
            },
            include: {
                branches: true
            }
        })

        return {
            message: "Store fetched successfully from db",
            payload: store,
            error: false
        }

    } catch (error) {
        return formatErrorResponse("Error fetching store from db", error, null)
    }
}
