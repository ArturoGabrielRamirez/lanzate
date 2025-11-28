"use server"

import { actionWrapper } from "@/features/global/utils"
import { getProductsCountByCategoryData } from "@/features/products/data/get-products-by-category.data"

export async function getProductsCountByCategoryAction(categoryId: number, storeId: number) {
    return actionWrapper(async () => {

        const { payload, error, message } = await getProductsCountByCategoryData(categoryId, storeId)

        if (error) throw new Error(message)

        return {
            payload: payload,
            hasError: false,
            message: "Cantidad de productos obtenida exitosamente"
        }
    })
} 