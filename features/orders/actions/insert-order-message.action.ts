"use server"

import { MessageType } from "@prisma/client"
import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { insertOrderMessageData } from "@/features/orders/data/insert-order-message.data"

type InsertOrderMessageActionProps = {
    orderId: string
    message: string
    messageType?: MessageType
    fileUrl?: string
    fileName?: string
    fileSize?: number
    pathname: string
}

export async function insertOrderMessageAction({
    orderId,
    message,
    messageType,
    fileUrl,
    fileName,
    fileSize,
    pathname
}: InsertOrderMessageActionProps) {
    return actionWrapper(async () => {
        const { payload: newMessage, error, message: resultMessage } = await insertOrderMessageData({
            orderId,
            message,
            messageType,
            fileUrl,
            fileName,
            fileSize
        })

        if (error) throw new Error(resultMessage)

        // Revalidate the path to refresh the messages
        revalidatePath(pathname)

        return {
            message: "Message sent successfully",
            payload: newMessage,
            hasError: false
        }

    })
} 