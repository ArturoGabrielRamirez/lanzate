"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper, formatSuccessResponse } from "@/features/global/utils"
import { insertOrderMessageData } from "@/features/orders/data/insert-order-message.data"
import { InsertOrderMessageActionProps } from "@/features/orders/types"

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
        const { payload: newMessage, hasError: hasError, message: resultMessage } = await insertOrderMessageData({
            orderId,
            message,
            messageType,
            fileUrl,
            fileName,
            fileSize
        })

        if (hasError) throw new Error(resultMessage)

        // Revalidate the path to refresh the messages
        revalidatePath(pathname)

        return formatSuccessResponse("Mensaje enviado con éxito", newMessage)

    })
} 