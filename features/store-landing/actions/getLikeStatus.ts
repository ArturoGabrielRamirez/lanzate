"use server"

import { actionWrapper } from "@/utils/lib"
import { getUserProductLike } from "../data/getUserProductLike"

export async function getLikeStatus(userId: number, productId: number) {
    return actionWrapper(async () => {
        
        const { payload, error, message } = await getUserProductLike(userId, productId)
        
        if (error || !payload) {
            throw new Error(message || "Failed to get like status")
        }

        return {
            message: "Like status retrieved successfully",
            payload,
            error: false
        }
    })
} 