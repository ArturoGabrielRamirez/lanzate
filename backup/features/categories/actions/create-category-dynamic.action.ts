"use server"

import { revalidatePath } from "next/cache"

import { insertCategoryData } from "@/features/categories/data"
import { CreateCategoryDynamicAction } from "@/features/categories/types"

export async function createCategoryDynamicAction({ storeId, categoryName }: CreateCategoryDynamicAction) {
    if (!storeId || isNaN(storeId)) {
        return {
            payload: null,
            error: true,
            message: "ID de tienda inválido"
        }
    }

    const { hasError, message, payload: category } = await insertCategoryData({
        storeId,
        payload: {
            name: categoryName,
            sort_order: 999, // Colocar al final
            description: "",
            image: "",
            is_default: false
        }
    })

    if (hasError) {
        return {
            payload: null,
            error: true,
            message: message
        }
    }

    revalidatePath(`/stores/${storeId}/categories`)
    revalidatePath(`/stores/${storeId}`)

    return {
        payload: category,
        error: false,
        message: "Categoría creada exitosamente"
    }
}
