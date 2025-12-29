"use server"

import { actionWrapper } from "@/features/global/utils"
import { selectStoreAddressBySlugData } from "@/features/stores/data/select-store-address-by-slug.data"

export async function getStoreAddressBySlugAction(slug: string) {
    return actionWrapper(async () => {

        const { payload: addressData } = await selectStoreAddressBySlugData(slug)

        return {
            message: "Dirección de la tienda recuperada con éxito",
            payload: addressData,
            hasError: false
        }
    })
}

