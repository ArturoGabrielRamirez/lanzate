"use server"

import { actionWrapper } from "@/utils/lib"
import { getOrderMessages } from "../data/getOrderMessages"

export async function fetchOrderMessages(orderId: number) {
    return actionWrapper(async () => {
        const messages = await getOrderMessages(orderId)

        return {
            error: false,
            message: "Messages fetched successfully",
            payload: messages
        }
    })
}
