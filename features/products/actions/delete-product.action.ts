"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { insertLogEntry } from "@/features/global/data/insertLogEntry"
import { deleteProductData as deleteProductFromDb } from "@/features/products/data/delete-product.data"


export async function deleteProductAction(productId: number, slug: string, userId: number) {
    return actionWrapper(async () => {

        //Check user owns product or is employee

        //Soft delete product from database
        const { hasError, message, payload } = await deleteProductFromDb(productId)
        if (hasError) throw new Error(message)

        //Revalidate path
        revalidatePath(`/stores/${slug}`)

        // Create action log
        const { error: logError } = await insertLogEntry({
            action: "DELETE",
            entity_type: "PRODUCT",
            entity_id: productId,
            user_id: userId,
            action_initiator: "Delete product button",
            details: "Product soft deleted using delete product button"
        })

        if (logError) throw new Error("The action went through but there was an error creating a log entry for this.")

        return {
            hasError: false,
            message: "Product soft deleted successfully",
            payload: payload
        }
    })
} 