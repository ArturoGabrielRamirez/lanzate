"use server"

import { actionWrapper, formatSuccessResponse } from "@/features/global/utils"
import { getMessagesFromOrderData } from "@/features/orders/data/get-messages-from-order.data"
import { GetMessagesFromOrderActionProps } from "@/features/orders/types"

export async function getMessagesFromOrderAction({ storeSlug, orderId }: GetMessagesFromOrderActionProps) {
    return actionWrapper(async () => {

        const { payload: messages, hasError: error, message } = await getMessagesFromOrderData({ storeSlug, orderId })

        if (error) throw new Error(message)

        return formatSuccessResponse("Messages fetched successfully", messages)
    })
} 