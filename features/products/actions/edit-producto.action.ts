"use server"

import { revalidatePath } from "next/cache"

import { insertLogEntry } from "@/features/global/data/insert-log-entry.data"
import { actionWrapper } from "@/features/global/utils"
import { updateProductData as updateProductInDb } from "@/features/products/data/update-product.data"
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
        const { hasError: logError } = await insertLogEntry({
            action: "UPDATE",
            entity_type: "PRODUCT",
            entity_id: productId,
            user_id: userId,
            action_initiator: "Formulario de edición de producto",
            details: "Producto actualizado usando el formulario de edición de producto"
        })

        if (logError) throw new Error("La acción se realizó pero hubo un error al crear una entrada de registro para esto.")
        return {
            message: "Producto actualizado exitosamente",
            payload: payload,
            hasError: false
        }

    })
} 