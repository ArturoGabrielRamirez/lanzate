"use server"

import { actionWrapper } from "@/features/global/utils"
import { getProductsCountByCategory } from "@/features/products/data/getProductsCountByCategory"

export async function getProductsCountByCategoryAction(categoryId: number, storeId: number) {
    return actionWrapper(async () => {

        const { payload, error, message } = await getProductsCountByCategory(categoryId, storeId)

        if (error) throw new Error(message)

        return {
            payload: payload,
            hasError: false,
            message: "Products count fetched successfully"
        }
    })
} 