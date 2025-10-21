"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { toggleProductLike } from "@/features/products/data/toggle-product-like.data"

export async function toggleLikeAction(productId: number, userId: number, pathname: string) {
    return actionWrapper(async () => {

        const { payload, error, message } = await toggleProductLike(userId, productId)

        if (error || !payload) {
            throw new Error(message || "Failed to toggle like")
        }

        revalidatePath(pathname)

        return {
            message: message,
            payload: payload,
            hasError: false
        }
    })
} 