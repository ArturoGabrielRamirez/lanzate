"use server"

import { actionWrapper } from "@/features/global/utils"
import { selectStoreHeaderBySlugData } from "@/features/stores/data"

export async function getStoreHeaderBySlugAction(slug: string) {
    return actionWrapper(async () => {

        const { payload: store, hasError, message } = await selectStoreHeaderBySlugData(slug)

        if (hasError) throw new Error(message)

        if (!store) {
            throw new Error("Tienda no encontrada")
        }

        return {
            message: "Banner de la tienda recuperado con éxito desde la base de datos",
            payload: store,
            hasError: false
        }
    })
} 