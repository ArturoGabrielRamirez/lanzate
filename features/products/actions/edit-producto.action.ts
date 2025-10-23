"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { insertLogEntry } from "@/features/layout/data/insertLogEntry"
import { updateProduct as updateProductInDb } from "@/features/products/data/update-product.data"
import { UpdateProductPayload } from "@/features/products/types"

export async function editProductAction(productId: number, data: UpdateProductPayload, slug: string, userId: number) {
    return actionWrapper(async () => {

        //Check user owns product

        //Check SKU uniqueness if changed
        //Update product fields
        //Update image/video if provided
        const { hasError, payload, message } = await updateProductInDb(productId, data)

        if (hasError) throw new Error(message)

        revalidatePath(`/stores/${slug}`)

        //Create action log
        const { error: logError } = await insertLogEntry({
            action: "UPDATE",
            entity_type: "PRODUCT",
            entity_id: productId,
            user_id: userId,
            action_initiator: "Edit product form",
            details: "Product updated using edit product form"
        })

        if (logError) throw new Error("The action went through but there was an error creating a log entry for this.")

        return {
            message: "Product updated successfully",
            payload: payload,
            hasError: false
        }

    })
} 