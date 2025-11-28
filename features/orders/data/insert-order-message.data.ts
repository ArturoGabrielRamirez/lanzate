"use server"

import { getUserInfo } from "@/features/global/actions/get-user-info.action"
import { formatSuccessResponse } from "@/features/global/utils"
import { InsertOrderMessageProps } from "@/features/orders/types"
import { prisma } from "@/utils/prisma"

export async function insertOrderMessageData({
    orderId,
    message,
    messageType = "STORE_TO_CUSTOMER",
    fileUrl,
    fileName,
    fileSize
}: InsertOrderMessageProps) {
    // Get current user
    const { payload: user, hasError: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        throw new Error(userMessage || "Usuario no autenticado")
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
        throw new Error("Pedido no encontrado")
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

    return formatSuccessResponse("Mensaje enviado con éxito", newMessage)
}