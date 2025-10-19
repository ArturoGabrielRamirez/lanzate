"use server"

import { actionWrapper } from "@/features/global/utils"
import { selectStoreBasicsBySlugData } from "@/features/stores/data"

export async function getStoreBasicsBySlugAction(slug: string) {
    return actionWrapper(async () => {

        const { payload: store } = await selectStoreBasicsBySlugData(slug)

        return {
            message: "Store basics fetched successfully from db",
            payload: store,
            hasError: false
        }
    })
}