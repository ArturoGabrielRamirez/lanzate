"use server"

import { actionWrapper } from "@/features/global/utils"
import { searchProductsByNameData } from "@/features/products/data/search-products-by-name.data"

export async function searchProductsByNameAction(searchTerm: string, storeId: number) {
    return actionWrapper(async () => {
        
        if (!storeId) {
            throw new Error("Se requiere el ID de la tienda")
        }

        const { error, payload, message } = await searchProductsByNameData(searchTerm, storeId)

        if (error) {
            throw new Error(message)
        }

        return {
            message: message,
            payload: payload,
            hasError: false
        }
    })
} 