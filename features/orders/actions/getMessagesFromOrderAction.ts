"use server"

import { actionWrapper } from "@/utils/lib"
import { getMessagesFromOrder } from "../data/getMessagesFromOrder"

type GetMessagesFromOrderActionProps = {
    storeSlug: string
    orderId: string
}

export async function getMessagesFromOrderAction({ storeSlug, orderId }: GetMessagesFromOrderActionProps) {
    return actionWrapper(async () => {
        const { payload: messages, error, message } = await getMessagesFromOrder({ storeSlug, orderId })

        if (error) throw new Error(message)

        return {
            message: "Messages fetched successfully",
            payload: messages,
            error: false
        }

    })
} 