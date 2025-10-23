"use server"

import { actionWrapper } from "@/features/global/utils"
import { selectProductByIdData } from "@/features/products/data/select-product-by-id.data"

export async function getProductDetailsAction(id: string) {
    return actionWrapper(async () => {

        const parsedId = parseInt(id)

        if (isNaN(parsedId)) throw new Error("Invalid product id")

        const { payload: product, hasError, message } = await selectProductByIdData(parsedId)

        if (hasError) throw new Error(message)

        return {
            payload: product,
            hasError: false,
            message: "Product details fetched successfully"
        }

    })
}
