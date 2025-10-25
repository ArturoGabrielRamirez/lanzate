"use server"

import { getOrderMessagesData } from "@/features/chat/data/get-order-messages.data"
import { OrderIdProp } from "@/features/chat/types"
import { actionWrapper } from "@/utils/lib"

export async function fetchOrderMessagesAction({ orderId }: OrderIdProp) {
    return actionWrapper(async () => {
        const messages = await getOrderMessagesData({ orderId })

        return {
            error: false,
            message: "Messages fetched successfully",
            payload: messages
        }
    })
}
