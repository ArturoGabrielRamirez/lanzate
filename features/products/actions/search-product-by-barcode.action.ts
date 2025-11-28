"use server"

import { actionWrapper } from "@/features/global/utils"
import { getProductByBarcodeData } from "@/features/products/data/get-product-by-barcode.data"

export async function searchProductByBarcodeAction(barcode: string, storeId: number) {
    return actionWrapper(async () => {

        if (!barcode || barcode.trim() === '') {
            throw new Error("Se requiere el código de barras")
        }

        if (!storeId) {
            throw new Error("Se requiere el ID de la tienda")
        }

        const { error, payload, message } = await getProductByBarcodeData(barcode.trim(), storeId)

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