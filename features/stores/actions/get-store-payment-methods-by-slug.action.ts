"use server"

import { actionWrapper } from "@/features/global/utils"
import { selectStorePaymentMethodsBySlugData } from "@/features/stores/data"

export async function getStorePaymentMethodsBySlugAction(slug: string) {
    return actionWrapper(async () => {

        const { payload: store } = await selectStorePaymentMethodsBySlugData(slug)

        return {
            message: "Métodos de pago de la tienda recuperados con éxito",
            payload: store,
            hasError: false
        }
    })
}

