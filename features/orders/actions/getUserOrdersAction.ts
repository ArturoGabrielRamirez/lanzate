"use server"

import { actionWrapper } from "@/utils/lib"
import { getUserOrders } from "../data/getUserOrders"

export async function getUserOrdersAction(userId: number) {
    return actionWrapper(async () => {
        if (!userId) {
            throw new Error("User ID is required")
        }

        const { payload, error, message } = await getUserOrders(userId)

        if (error) {
            throw new Error(message)
        }

        return {
            message: message,
            payload: payload,
            error: false
        }
    })
} 