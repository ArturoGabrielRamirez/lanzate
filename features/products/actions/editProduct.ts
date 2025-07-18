"use server"

import { formatErrorResponse } from "@/utils/lib"
import { updateProduct as updateProductInDb } from "../data/updateProduct"
import { revalidatePath } from "next/cache"

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