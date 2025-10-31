"use server"

import { actionWrapper } from "@/features/global/utils"
import { selectStoreBySlugData } from "@/features/stores/data"

export async function getStoresFromSlugAction(slug: string){

    return actionWrapper(async () => {
        const { payload: store, hasError, message } = await selectStoreBySlugData(slug)

        if (hasError) throw new Error(message)

        if (!store)
            throw new Error("Store not found")

        return {
            message: "Store fetched successfully from db",
            payload: store,
            hasError: false
        }
    })
}
