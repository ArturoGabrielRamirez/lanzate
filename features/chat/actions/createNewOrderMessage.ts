"use server"

import { actionWrapper } from "@/utils/lib"
import { insertNewOrderMessage } from "../data/insertnewOrderMessage"
import { MessageType } from "@prisma/client"

export async function createNewOrderMessage(orderId: number, message: string, messageType: MessageType) {

    return actionWrapper(async () => {

        const newMessage = await insertNewOrderMessage(orderId, message, messageType)

        return {
            error: false,
            message: "Message created successfully",
            payload: null
        }

    })

}