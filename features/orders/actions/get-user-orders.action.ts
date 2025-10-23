"use server"

import { actionWrapper } from "@/features/global/utils"
import { getUserOrdersData } from "@/features/orders/data/get-user-orders.data"

export async function getUserOrdersAction(userId: number) {
    return actionWrapper(async () => {
        if (!userId) {
            throw new Error("User ID is required")
        }

        const { payload, error, message } = await getUserOrdersData(userId)

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