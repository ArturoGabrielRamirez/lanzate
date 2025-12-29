"use server"

import { actionWrapper } from "@/features/global/utils"
import { selectStoreContactsBySlugData } from "@/features/stores/data"

export async function getStoreContactsBySlugAction(slug: string) {
    return actionWrapper(async () => {

        const { payload: store } = await selectStoreContactsBySlugData(slug)

        return {
            message: "Datos básicos de la tienda recuperados con éxito desde la base de datos",
            payload: store,
            hasError: false
        }
    })
}