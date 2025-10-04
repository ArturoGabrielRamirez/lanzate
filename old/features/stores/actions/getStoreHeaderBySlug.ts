"use server"

import { actionWrapper } from "@/utils/lib"
import { selectStoreHeaderBySlug } from "../data/selectStoreHeaderBySlug"

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

type GetStoreHeaderBySlugReturn = {
    message: string
    payload: StoreHeader | null
    error: boolean
}

export async function getStoreHeaderBySlug(slug: string): Promise<GetStoreHeaderBySlugReturn> {
    return actionWrapper(async () => {
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
    })
} 