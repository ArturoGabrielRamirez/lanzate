"use server"

import { actionWrapper } from "@/features/global/utils"
import { selectStoreBySlugData } from "@/features/stores/data"

export async function getStoresFromSlugAction(slug: string){

    return actionWrapper(async () => {
        const { payload: store, hasError, message } = await selectStoreBySlugData(slug)

        if (hasError) throw new Error(message)

        if (!store)
            throw new Error("Tienda no encontrada")

        return {
            message: "Tienda recuperada con éxito desde la base de datos",
            payload: store,
            hasError: false
        }
    })
}
