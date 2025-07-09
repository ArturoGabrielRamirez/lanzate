"use server"

import { formatErrorResponse } from "@/utils/lib"
import { updateProduct as updateProductInDb } from "../data/updateProduct"
import { revalidatePath } from "next/cache"

/**
 * Action to update a product by its ID.
 * @param productId - The ID of the product to update
 * @param data - The fields to update (name, price, stock, description)
 * @param slug - The slug of the store the product belongs to (for revalidation)
 */
export async function editProduct(productId: number, data: any, slug: string) {
    try {
        const { error, payload, message } = await updateProductInDb(productId, data)
        if (error) throw new Error(message)
        revalidatePath(`/stores/${slug}`)
        return {
            message: "Product updated successfully",
            payload: payload,
            error: false
        }
    } catch (error) {
        return formatErrorResponse("Error updating product", error, null)
    }
} 