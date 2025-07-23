"use server"

import { actionWrapper } from "@/utils/lib"
import { selectOrderById } from "../data/selectOrderById"

export async function getOrderDetails(id: string) {
    return actionWrapper(async () => {

        const parsedId = parseInt(id)

        if (isNaN(parsedId)) throw new Error("Invalid order id")

        const { payload: order, error, message } = await selectOrderById(parsedId)

        if (error) throw new Error(message)

        return {
            payload: order,
            error: false,
            message: "Order details fetched successfully"
        }

    })
} 