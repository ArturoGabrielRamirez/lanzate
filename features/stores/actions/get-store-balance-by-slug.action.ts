"use server"

import { actionWrapper } from "@/features/global/utils"
import { selectStoreBalanceBySlugData } from "@/features/stores/data"

export async function getStoreBalanceBySlugAction(slug: string) {
    return actionWrapper(async () => {

        const { payload: balance } = await selectStoreBalanceBySlugData(slug)

        return {
            message: "Store balance fetched successfully from db",
            payload: balance,
            hasError: false
        }

    })
}