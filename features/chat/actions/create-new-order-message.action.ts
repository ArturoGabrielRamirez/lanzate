"use server"

import { insertNewOrderMessageData } from "@/features/chat/data/insert-new-order-message.data"
import { CreateNewOrderMessageAction } from "@/features/chat/types"
import { actionWrapper } from "@/utils/lib"

export async function createNewOrderMessageAction({ orderId, message, messageType }: CreateNewOrderMessageAction) {

    return actionWrapper(async () => {

        const newMessage = await insertNewOrderMessageData({ orderId, message, messageType })

        if (!newMessage) throw new Error("Error creating message")

        return {
            error: false,
            message: "Message created successfully",
            payload: null
        }

    })

}