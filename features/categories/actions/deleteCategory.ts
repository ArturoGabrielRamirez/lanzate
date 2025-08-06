"use server"

import { revalidatePath } from "next/cache"
import { deleteCategory as deleteCategoryFromDb } from "@/features/categories/data"

export async function deleteCategory(storeId: number, categoryId: number) {
    const { error, message, payload: category } = await deleteCategoryFromDb(storeId, categoryId)

    if (error) {
        throw new Error(message)
    }

    revalidatePath(`/stores/${storeId}/categories`)
    revalidatePath(`/stores/${storeId}`)

    return category
} 