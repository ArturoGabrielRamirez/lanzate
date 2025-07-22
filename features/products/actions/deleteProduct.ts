"use server"

import { actionWrapper } from "@/utils/lib"
import { deleteProduct as deleteProductFromDb } from "../data/deleteProduct"
import { revalidatePath } from "next/cache"
import { insertLogEntry } from "@/features/layout/data/insertLogEntry"


export async function deleteProduct(productId: number, slug: string, userId: number) {
    return actionWrapper(async () => {

        //Check user owns product or is employee

        //Delete product from database
        const { error, message, payload } = await deleteProductFromDb(productId)
        if (error) throw new Error(message)

        //Revalidate path
        revalidatePath(`/stores/${slug}`)

        // Create action log
        const { error: logError } = await insertLogEntry({
            action: "DELETE",
            entity_type: "PRODUCT",
            entity_id: productId,
            user_id: userId,
            action_initiator: "Delete product button",
            details: "Product deleted using delete product button"
        })

        if (logError) throw new Error("The action went through but there was an error creating a log entry for this.")

        return {
            error: false,
            message: "Product deleted successfully",
            payload: payload
        }
    })
} 