"use server"

import { actionWrapper } from "@/features/global/utils"
import { selectStoreBalanceBySlugData } from "@/features/stores/data"

export async function getStoreBalanceBySlugAction(slug: string) {
    return actionWrapper(async () => {

        const { payload: balance } = await selectStoreBalanceBySlugData(slug)

        return {
            message: "Balance de la tienda recuperado con éxito desde la base de datos",
            payload: balance,
            hasError: false
        }

    })
}