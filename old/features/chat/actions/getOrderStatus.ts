"use server"

import { actionWrapper } from "@/utils/lib"
import { getOrderStatus } from "../data/getOrderStatus"

export async function fetchOrderStatus(orderId: number) {
    return actionWrapper(async () => {
        const order = await getOrderStatus(orderId)

        return {
            error: false,
            message: "Order status fetched successfully",
            payload: order
        }
    })
}
