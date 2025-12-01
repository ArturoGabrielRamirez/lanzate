"use server"

import { getStoreCategoriesData } from "@/features/categories/data/get-store-categories.data"
import { GetStoreCategoriesAction } from "@/features/categories/types"

export async function getStoreCategoriesAction({ storeId }: GetStoreCategoriesAction) {
    if (!storeId || isNaN(storeId)) {
        return {
            payload: [],
            error: true,
            message: "ID de tienda inválido"
        }
    }

    const { hasError, message, payload: categories } = await getStoreCategoriesData({ storeId })

    if (hasError) {
        return {
            payload: [],
            error: true,
            message: message
        }
    }

    return {
        payload: categories || [],
        error: false,
        message: "Categorías recuperadas exitosamente"
    }
}

