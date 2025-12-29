"use server"

import { actionWrapper } from "@/features/global/utils"
import { getStoreLogsBySlugData } from "@/features/stores/data"

export async function getStoreLogsAction(slug: string) {
    return actionWrapper(async () => {

        const { hasError, message, payload } = await getStoreLogsBySlugData(slug)

        if (hasError) throw new Error(message)

        return {
            hasError: false,
            message: "Registros de la tienda recuperados con éxito",
            payload: payload
        }

    })
} 