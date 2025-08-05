"use server"

import { revalidatePath } from "next/cache"
import { insertCategory } from "@/features/categories/data"

export async function createCategoryDynamic(storeId: number, categoryName: string) {
    const { error, message, payload: category } = await insertCategory(storeId, {
        name: categoryName,
        sort_order: 999 // Colocar al final
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