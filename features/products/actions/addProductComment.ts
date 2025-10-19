"use server"

import { actionWrapper } from "@/utils/lib"
import { insertProductComment } from "../data/insertProductComment"
import { revalidatePath } from "next/cache"

export async function addProductComment(formData: { content: string }, productId: number, userId: number, pathname: string) {
    return actionWrapper(async () => {
        
        if (!formData.content || formData.content.trim().length === 0) {
            throw new Error("Comment content is required")
        }

        if (formData.content.trim().length > 500) {
            throw new Error("Comment cannot exceed 500 characters")
        }
        
        const { payload, error, message } = await insertProductComment(userId, productId, formData.content.trim())
        
        if (error || !payload) {
            throw new Error(message || "Failed to add comment")
        }

        revalidatePath(pathname)
        
        return {
            message: "Comment added successfully",
            payload: payload,
            error: false
        }
    })
} 