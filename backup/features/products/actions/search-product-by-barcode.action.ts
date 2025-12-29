"use server"

import { ServerResponse } from "@/features/global/types/action-wrapper.types"
import { actionWrapper } from "@/features/global/utils"
import { getProductByBarcodeData } from "@/features/products/data/get-product-by-barcode.data"
import { ProductData } from "@/features/sale/types"



export async function searchProductByBarcodeAction(
    barcode: string,
    storeId: number
): Promise<ServerResponse<ProductData>> {

    return actionWrapper<ProductData>(async () => {

        if (!barcode || barcode.trim() === '') {
            return {
                hasError: true,
                message: "Se requiere el código de barras",
                payload: null
            }
        }

        if (!storeId) {
            return {
                hasError: true,
                message: "Se requiere el ID de la tienda",
                payload: null
            }
        }

        const { hasError, payload, message } =
            await getProductByBarcodeData(barcode.trim(), storeId)

        if (hasError || !payload) {
            return {
                hasError: true,
                message,
                payload: null
            }
        }

        return {
            message,
            payload,
            hasError: false
        }
    })
}
