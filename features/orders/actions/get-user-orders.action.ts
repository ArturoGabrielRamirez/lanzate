"use server"

import { actionWrapper, formatSuccessResponse } from "@/features/global/utils"
import { getUserOrdersData } from "@/features/orders/data/get-user-orders.data"

export async function getUserOrdersAction(userId: number) {
    return actionWrapper(async () => {
        if (!userId) {
            throw new Error("User ID is required")
        }

        const { payload, hasError: hasError, message } = await getUserOrdersData(userId)

        if (hasError) throw new Error(message)

        return formatSuccessResponse("Órdenes obtenidas con éxito", payload)
    })
} 