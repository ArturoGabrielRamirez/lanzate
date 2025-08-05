"use server"

import { revalidatePath } from "next/cache"
import { insertCategory } from "@/features/categories/data"

export async function createCategory(storeId: number, payload: {
    name: string
    description?: string
    image?: string
    sort_order?: number
}) {
    const { error, message, payload: category } = await insertCategory(storeId, payload)

    if (error) {
        throw new Error(message)
    }

    revalidatePath(`/stores/${storeId}/categories`)
    revalidatePath(`/stores/${storeId}`)

    return category
} 