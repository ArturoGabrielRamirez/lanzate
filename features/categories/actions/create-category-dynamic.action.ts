"use server"

import { revalidatePath } from "next/cache"

import { insertCategory } from "@/features/categories/data"
import { CreateCategoryDynamicAction } from "@/features/categories/types"


export async function createCategoryDynamicAction({ storeId, categoryName }: CreateCategoryDynamicAction) {
    const { error, message, payload: category } = await insertCategory({
        storeId, payload: {
            name: categoryName,
            sort_order: 999, // Colocar al final
            description: "",
            image: "",
            is_default: false
        }
    })

    if (error) {
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