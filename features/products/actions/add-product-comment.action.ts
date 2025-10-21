"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { insertProductComment } from "@/features/products/data/insert-product-comment.data"

export async function addProductCommentAction(formData: { content: string }, productId: number, userId: number, pathname: string) {
    return actionWrapper(async () => {

        if (!formData.content || formData.content.trim().length === 0) {
            throw new Error("Comment content is required")
        }

        if (formData.content.trim().length > 500) {
            throw new Error("Comment cannot exceed 500 characters")
        }

        const { payload, hasError, message } = await insertProductComment(userId, productId, formData.content.trim())

        if (hasError || !payload) {
            throw new Error(message || "Failed to add comment")
        }

        revalidatePath(pathname)

        return {
            message: "Comment added successfully",
            payload: payload,
            hasError: false
        }
    })
} 