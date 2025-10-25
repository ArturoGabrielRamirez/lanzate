"use server"

import { revalidatePath } from "next/cache"

import { deleteCategory as deleteCategoryFromDb } from "@/features/categories/data"
import { DeleteCategoryAction } from "@/features/categories/types"

export async function deleteCategoryAction({ storeId, categoryId }: DeleteCategoryAction) {
    const { error, message, payload: category } = await deleteCategoryFromDb({ storeId, categoryId })

    if (error) {
        throw new Error(message)
    }

    revalidatePath(`/stores/${storeId}/categories`)
    revalidatePath(`/stores/${storeId}`)

    return category
} 