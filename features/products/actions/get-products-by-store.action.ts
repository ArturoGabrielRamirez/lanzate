"use server"

import { unstable_cache } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { selectProductsByStoreData } from "@/features/products/data/select-products-by-store.data"
import { StoreIdentifier } from "@/features/products/types/products-by-store.types"

export async function getProductsByStoreAction(identifier: StoreIdentifier, limit: number, orderBy: string, page: number, search: string) {

    return actionWrapper(async () => {
        const { payload, hasError, message } = await unstable_cache(selectProductsByStoreData, ['products-by-store'], {
            revalidate: 60,
            tags: ['products-by-store']
        })(identifier, limit, orderBy, page, search)

        if (hasError) throw new Error(message)

        return {
            hasError: false,
            message: message,
            payload: payload
        }
    })
}

