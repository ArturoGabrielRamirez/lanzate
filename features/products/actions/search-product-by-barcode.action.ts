"use server"

import { getProductByBarcode } from "@/features/products/data/get-product-by-barcode"
import { actionWrapper } from "@/utils/lib"

export async function searchProductByBarcodeAction(barcode: string, storeId: number) {
    return actionWrapper(async () => {
        
        if (!barcode || barcode.trim() === '') {
            throw new Error("Barcode is required")
        }

        if (!storeId) {
            throw new Error("Store ID is required")
        }

        const { error, payload, message } = await getProductByBarcode(barcode.trim(), storeId)

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