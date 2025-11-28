"use server"

import { revalidatePath } from "next/cache"

import { insertLogEntry } from "@/features/global/data/insert-log-entry.data"
import { actionWrapper } from "@/features/global/utils"
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
        const { hasError: logError } = await insertLogEntry({
            action: "DELETE",
            entity_type: "PRODUCT",
            entity_id: productId,
            user_id: userId,
            action_initiator: "Botón eliminar producto",
            details: "Producto eliminado usando el botón eliminar producto. Las órdenes relacionadas mantienen sus datos pero las referencias al producto se establecen en NULL."
        })

        if (logError) throw new Error("La acción se realizó pero hubo un error al crear una entrada de registro para esto.")

        return {
            hasError: false,
            message: "Producto eliminado exitosamente. Las órdenes relacionadas mantienen sus datos pero las referencias al producto se establecen en NULL.",
            payload: payload
        }
    })
} 