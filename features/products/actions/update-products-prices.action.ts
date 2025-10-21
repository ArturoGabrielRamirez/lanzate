"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { updateProductsPrices } from "@/features/products/data/update-product-prices.data"

type UpdatePricesActionPayload = {
    storeId: number
    amount: number
    updateType: "fijo" | "porcentaje"
    productIds?: number[]
    categoryId?: number
}

export async function updateProductsPricesAction(payload: UpdatePricesActionPayload) {
    return actionWrapper(async () => {
        const result = await updateProductsPrices(payload)
        
        // Revalidate the store products page to reflect the changes
        revalidatePath(`/stores/${payload.storeId}/products`)
        
        return {
            hasError: false,
            message: "Precios actualizados correctamente",
            payload: result
        }
    })
} 