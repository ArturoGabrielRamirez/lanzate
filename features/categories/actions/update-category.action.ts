"use server"

import { revalidatePath } from "next/cache"

import { updateCategory as updateCategoryInDb } from "@/features/categories/data"
import { UpdateCategoryAction } from "@/features/categories/types"

export async function updateCategoryAction({ storeId, categoryId, payload }: UpdateCategoryAction) {
    const { hasError, message, payload: category } = await updateCategoryInDb({ storeId, categoryId, payload })

    if (hasError) {
        throw new Error(message)
    }

    revalidatePath(`/stores/${storeId}/categories`)
    revalidatePath(`/stores/${storeId}`)

    return category
} 