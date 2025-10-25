"use server"

import { InsertNewOrderMessageDataProps } from "@/features/chat/types"
import { getUserInfo } from "@/features/global/actions/get-user-info.action"
import { prisma } from "@/utils/prisma"

export async function insertNewOrderMessageData({ orderId, message, messageType }: InsertNewOrderMessageDataProps) {

    const { payload: user, hasError: error, message: userMessage } = await getUserInfo()

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