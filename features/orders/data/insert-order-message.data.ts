"use server"

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { MessageType } from "@prisma/client"

type InsertOrderMessageProps = {
    orderId: string
    message: string
    messageType?: MessageType
    fileUrl?: string
    fileName?: string
    fileSize?: number
}

export async function insertOrderMessageData({ 
    orderId, 
    message, 
    messageType = "STORE_TO_CUSTOMER",
    fileUrl,
    fileName,
    fileSize
}: InsertOrderMessageProps) {
    return actionWrapper(async () => {
        // Get current user
        const { payload: user, error: userError, message: userMessage } = await getUserInfo()

        if (userError || !user) {
            throw new Error(userMessage || "User not authenticated")
        }

        // Verify order exists
        const order = await prisma.order.findUnique({
            where: {
                id: parseInt(orderId)
            },
            select: {
                id: true,
                store_id: true
            }
        })

        if (!order) {
            throw new Error("Order not found")
        }

        // Create the message
        const newMessage = await prisma.orderMessage.create({
            data: {
                order_id: parseInt(orderId),
                sender_id: user.id,
                message: message.trim(),
                message_type: messageType,
                file_url: fileUrl,
                file_name: fileName,
                file_size: fileSize
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        email: true,
                        avatar: true
                    }
                }
            }
        })

        return {
            message: "Message sent successfully",
            payload: newMessage,
            error: false
        }

    })
} 