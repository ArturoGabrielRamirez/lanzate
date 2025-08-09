"use server"

import { getProductsCountByCategory } from "../data/getProductsCountByCategory"
import { actionWrapper } from "@/utils/lib"

export async function getProductsCountByCategoryAction(categoryId: number, storeId: number) {
    return actionWrapper(async () => {
        return await getProductsCountByCategory(categoryId, storeId)
    })
} 