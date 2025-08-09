"use server"

import { updateProductsPrices } from "../data/updateProductsPrices"
import { actionWrapper } from "@/utils/lib"
import { revalidatePath } from "next/cache"

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
            error: false,
            message: "Precios actualizados correctamente",
            payload: result
        }
    })
} 