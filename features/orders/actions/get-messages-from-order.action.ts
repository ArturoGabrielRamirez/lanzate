"use server"

import { actionWrapper } from "@/utils/lib"
import { getMessagesFromOrderData } from "../data/get-messages-from-order.data"

type GetMessagesFromOrderActionProps = {
    storeSlug: string
    orderId: string
}

export async function getMessagesFromOrderAction({ storeSlug, orderId }: GetMessagesFromOrderActionProps) {
    return actionWrapper(async () => {
        const { payload: messages, error, message } = await getMessagesFromOrderData({ storeSlug, orderId })

        if (error) throw new Error(message)

        return {
            message: "Messages fetched successfully",
            payload: messages,
            error: false
        }

    })
} 