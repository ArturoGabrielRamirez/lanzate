"use server"

import { formatErrorResponse } from "@/utils/lib"
import { selectStoreHeaderBySlug } from "../data/selectStoreHeaderBySlug"

type StoreHeader = {
    name: string
    description: string | null
    balance: {
        current_balance: number
    } | null
}

type GetStoreHeaderBySlugReturn = {
    message: string
    payload: StoreHeader | null
    error: boolean
}

export async function getStoreHeaderBySlug(slug: string): Promise<GetStoreHeaderBySlugReturn> {
    try {
        const { payload: store, error, message } = await selectStoreHeaderBySlug(slug)

        if (error) throw new Error(message)

        if (!store) {
            throw new Error("Store not found")
        }

        return {
            message: "Store header fetched successfully",
            payload: store,
            error: false
        }
    } catch (error) {
        return formatErrorResponse("Error fetching store header", error, null)
    }
} 