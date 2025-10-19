"use server"

import { actionWrapper } from "@/features/global/utils"
import { selectStoreHeaderBySlugData } from "@/features/stores/data"

export async function getStoreHeaderBySlugAction(slug: string) {
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