"use server"

import { actionWrapper } from "@/utils/lib"
import { toggleProductLike } from "./toggleProductLike"
import { revalidatePath } from "next/cache"

export async function toggleLike(productId: number, userId: number, pathname: string) {
    return actionWrapper(async () => {
        
        const { payload, error, message } = await toggleProductLike(userId, productId)
        
        if (error || !payload) {
            throw new Error(message || "Failed to toggle like")
        }

        revalidatePath(pathname)
        
        return {
            message: message,
            payload: payload,
            error: false
        }
    })
} 