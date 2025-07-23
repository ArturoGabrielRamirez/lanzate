"use server"

import { formatErrorResponse } from "@/utils/lib"
import { selectOrderById } from "../data/selectOrderById"

export async function getOrderDetails(id: string) {
    try {

        const parsedId = parseInt(id)

        if (isNaN(parsedId)) throw new Error("Invalid order id")

        const { payload: order, error, message } = await selectOrderById(parsedId)

        if (error) throw new Error(message)

        return {
            payload: order,
            error: false,
            message: "Order details fetched successfully"
        }

    } catch (error) {
        return formatErrorResponse("Error fetching order details", error)
    }
} 