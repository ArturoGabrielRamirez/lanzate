"use server"

import { actionWrapper } from "@/features/global/utils"
import { selectOrderByIdData } from "@/features/orders/data/select-order-by-id.data"

export async function getOrderDetailsAction(id: string) {
    return actionWrapper(async () => {

        const parsedId = parseInt(id)

        if (isNaN(parsedId)) throw new Error("Invalid order id")

        const { payload: order, error, message } = await selectOrderByIdData(parsedId)

        if (error) throw new Error(message)

        return {
            payload: order,
            hasError: false,
            message: "Order details fetched successfully"
        }

    })
} 