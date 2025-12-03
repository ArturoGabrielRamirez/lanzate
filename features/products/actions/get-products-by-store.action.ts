"use server"

import { actionWrapper } from "@/features/global/utils"
import { selectProductsByStoreData } from "@/features/products/data/select-products-by-store.data"
import { StoreIdentifier } from "@/features/products/types/products-by-store.types"

export async function getProductsByStoreAction(identifier: StoreIdentifier) {
    return actionWrapper(async () => {
        const { payload, hasError, message } = await selectProductsByStoreData(identifier)

        if (hasError) throw new Error(message)

        return {
            hasError: false,
            message: message,
            payload: payload
        }
    })
}

