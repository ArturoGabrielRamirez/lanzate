"use server"

import { actionWrapper } from "@/features/global/utils"
import { selectProductByIdData } from "@/features/products/data/select-product-by-id.data"

export async function getProductDetailsAction(id: string) {
    return actionWrapper(async () => {

        const parsedId = parseInt(id)

        if (isNaN(parsedId)) throw new Error("ID de producto inválido")

        const { payload: product, hasError, message } = await selectProductByIdData(parsedId)
        console.log("🚀 ~ getProductDetailsAction ~ product:", product)

        if (hasError) throw new Error(message)

        return {
            payload: product,
            hasError: false,
            message: "Detalles del producto obtenidos exitosamente"
        }

    })
}
