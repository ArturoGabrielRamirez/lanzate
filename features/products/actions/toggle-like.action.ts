"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { toggleProductLikeData } from "@/features/products/data/toggle-product-like.data"

export async function toggleLikeAction(productId: number, userId: number, pathname: string) {
    return actionWrapper(async () => {

        const { payload, error, message } = await toggleProductLikeData(userId, productId)

        if (error || !payload) {
            throw new Error(message || "Error al alternar el me gusta")
        }

        revalidatePath(pathname)

        return {
            message: message,
            payload: payload,
            hasError: false
        }
    })
} 