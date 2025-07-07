"use server"

import { formatErrorResponse } from "@/utils/lib"
import { selectStoreBySlug } from "../data/selectStoreBySlug"
import { Store } from "@/prisma/generated/prisma"

type GetStoresFromSlugReturn = {
    message: string
    payload: Store | null
    error: boolean
}

export async function getStoresFromSlug(slug: string): Promise<GetStoresFromSlugReturn> {

    try {
        const { payload: store, error, message } = await selectStoreBySlug(slug)

        if (error) throw new Error(message)

        return {
            message: "Store fetched successfully from db",
            payload: store,
            error: false
        }

    } catch (error) {
        return formatErrorResponse("Error fetching store from db", error, null)
    }
}
