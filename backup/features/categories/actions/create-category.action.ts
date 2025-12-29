/* "use server"

import { revalidatePath } from "next/cache"

import { insertCategory } from "@/features/categories/data"
import { CreateCategoryAction } from "@/features/categories/types"

export async function createCategoryAction({ storeId, payload }: CreateCategoryAction) {
    const { error, message, payload: category } = await insertCategory(storeId, payload)

    if (error) {
        throw new Error(message)
    }

    revalidatePath(`/stores/${storeId}/categories`)
    revalidatePath(`/stores/${storeId}`)

    return category
}  */