"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { updateProductsPricesData } from "@/features/products/data/update-product-prices.data"
import { UpdatePricesActionPayload } from "@/features/products/types"

export async function updateProductsPricesAction(payload: UpdatePricesActionPayload) {
    return actionWrapper(async () => {
        const result = await updateProductsPricesData(payload)
        
        // Revalidate the store products page to reflect the changes
        revalidatePath(`/stores/${payload.storeId}/products`)
        
        return {
            hasError: false,
            message: "Precios actualizados correctamente",
            payload: result
        }
    })
} 