"use server"

import { getOrderMessagesData } from "@/features/chat/data/get-order-messages.data"
import { OrderIdProp } from "@/features/chat/types"
import { actionWrapper } from '@/features/global/utils'

export async function fetchOrderMessagesAction({ orderId }: OrderIdProp) {
    return actionWrapper(async () => {
        const messages = await getOrderMessagesData({ orderId })

        return {
            hasError: false,
            message: "Mensajes recuperados exitosamente",
            payload: messages
        }
    })
}
