"use server"

import { actionWrapper } from "@/features/global/utils"
import { getOrderByIdData } from "@/features/orders/data/get-order-by-id.data"

export async function getOrderByIdAction(orderId: number, userId: number) {
    return actionWrapper(async () => {
        if (!orderId) {
            throw new Error("Se requiere el ID de la orden")
        }

        if (!userId) {
            throw new Error("Se requiere el ID del usuario")
        }

        const { payload, hasError: error, message } = await getOrderByIdData(orderId, userId)

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