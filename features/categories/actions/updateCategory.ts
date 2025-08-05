"use server"

import { revalidatePath } from "next/cache"
import { updateCategory as updateCategoryInDb } from "@/features/categories/data"

export async function updateCategory(
    storeId: number, 
    categoryId: number, 
    payload: {
        name?: string
        description?: string
        image?: string
        sort_order?: number
        is_active?: boolean
    }
) {
    const { error, message, payload: category } = await updateCategoryInDb(storeId, categoryId, payload)

    if (error) {
        throw new Error(message)
    }

    revalidatePath(`/stores/${storeId}/categories`)
    revalidatePath(`/stores/${storeId}`)

    return category
} 