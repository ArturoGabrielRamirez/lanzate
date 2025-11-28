"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { insertProductCommentData } from "@/features/products/data/insert-product-comment.data"

export async function addProductCommentAction(formData: { content: string }, productId: number, userId: number, pathname: string) {
    return actionWrapper(async () => {

        if (!formData.content || formData.content.trim().length === 0) {
            throw new Error("El contenido del comentario es obligatorio")
        }

        if (formData.content.trim().length > 500) {
            throw new Error("El comentario no puede exceder los 500 caracteres")
        }

        const { payload, hasError, message } = await insertProductCommentData(userId, productId, formData.content.trim())

        if (hasError || !payload) {
            throw new Error(message || "No se pudo agregar el comentario al producto")
        }

        revalidatePath(pathname)

        return {
            message: "Comentario agregado exitosamente",
            payload: payload,
            hasError: false
        }
    })
} 