"use server"

import { getUserInfo } from "@/features/layout/actions"
import { prisma } from "@/utils/prisma"
import { MessageType } from "@prisma/client"


export async function insertNewOrderMessage(orderId: number, message: string, messageType: MessageType) {

    const { payload: user, error, message: userMessage } = await getUserInfo()

    if (error || !user) throw new Error(userMessage)

    const newMessage = await prisma.orderMessage.create({
        data: {
            order_id: orderId,
            message: message,
            sender_id: user.id,
            message_type: messageType
        }
    })

    return newMessage

}