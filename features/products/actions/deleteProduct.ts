"use server"

import { formatErrorResponse } from "@/utils/lib"
import { deleteProduct as deleteProductFromDb } from "../data/deleteProduct"
import { revalidatePath } from "next/cache"

/**
 * Action to delete a product by its ID.
 * @param productId - The ID of the product to delete
 * @param slug - The slug of the store the product belongs to (for revalidation)
 */
export async function deleteProduct(productId: number, slug: string) {
    try {
        const { error, message, payload } = await deleteProductFromDb(productId)
        if (error) throw new Error(message)
        revalidatePath(`/stores/${slug}`)
        return {
            error: false,
            message: "Product deleted successfully",
            payload: payload
        }
    } catch (error) {
        return formatErrorResponse("Error deleting product", error, null)
    }
} 