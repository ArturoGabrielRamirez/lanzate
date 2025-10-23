"use server"

import { actionWrapper } from "@/features/global/utils"
import { getOrderByIdData } from "@/features/orders/data/get-order-by-id.data"

export async function getOrderByIdAction(orderId: number, userId: number) {
    return actionWrapper(async () => {
        if (!orderId) {
            throw new Error("Order ID is required")
        }

        if (!userId) {
            throw new Error("User ID is required")
        }

        const { payload, error, message } = await getOrderByIdData(orderId, userId)

        if (error) {
            throw new Error(message)
        }

        return {
            message: message,
            payload: payload,
            hasError: false
        }
    })
} 