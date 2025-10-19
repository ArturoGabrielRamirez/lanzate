"use server"

import { actionWrapper } from "@/features/global/utils"
import { selectStoreHeaderBySlugData } from "@/features/stores/data/select-store-header-by-slug.data"

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
    hasError: boolean
}

export async function getStoreHeaderBySlugAction(slug: string): Promise<GetStoreHeaderBySlugReturn> {
    return actionWrapper(async () => {

        const { payload: store, hasError, message } = await selectStoreHeaderBySlugData(slug)

        if (hasError) throw new Error(message)

        if (!store) {
            throw new Error("Store not found")
        }

        return {
            message: "Store header fetched successfully",
            payload: store,
            hasError: false
        }
    })
} 