"use server"

import { actionWrapper } from "@/utils/lib"
import { searchProductsByName } from "../data/search-products-by-name"

export async function searchProductsByNameAction(searchTerm: string, storeId: number) {
    return actionWrapper(async () => {
        
        if (!storeId) {
            throw new Error("Store ID is required")
        }

        const { error, payload, message } = await searchProductsByName(searchTerm, storeId)

        if (error) {
            throw new Error(message)
        }

        return {
            message: message,
            payload: payload,
            error: false
        }
    })
} 