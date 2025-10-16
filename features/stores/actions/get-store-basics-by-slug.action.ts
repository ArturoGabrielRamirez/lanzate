"use server"

import { actionWrapper } from "@/features/global/utils"
import { selectStoreBasicsBySlug } from "@/features/stores/data"

export async function getStoreBasicsBySlugAction(slug: string) {
    return actionWrapper(async () => {

        const { payload: store } = await selectStoreBasicsBySlug(slug)

        return {
            message: "Store basics fetched successfully from db",
            payload: store,
            hasError: false
        }
    })
}