"use server"

import { actionWrapper } from "@/features/global/utils"
import { selectStoreBasicsBySlugData } from "@/features/stores/data"

export async function getStoreBasicsBySlugAction(slug: string) {
    return actionWrapper(async () => {

        const { payload: store } = await selectStoreBasicsBySlugData(slug)

        return {
            message: "Datos básicos de la tienda recuperados con éxito desde la base de datos",
            payload: store,
            hasError: false
        }
    })
}