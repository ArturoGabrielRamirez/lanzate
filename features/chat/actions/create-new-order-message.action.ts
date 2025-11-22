"use server"

import { insertNewOrderMessageData } from "@/features/chat/data/insert-new-order-message.data"
import { CreateNewOrderMessageAction } from "@/features/chat/types"
import { actionWrapper } from '@/features/global/utils'

export async function createNewOrderMessageAction({ orderId, message, messageType }: CreateNewOrderMessageAction) {

    return actionWrapper(async () => {

        const newMessage = await insertNewOrderMessageData({ orderId, message, messageType })

        if (!newMessage) throw new Error("Error al crear el mensaje")

        return {
            hasError: false,
            message: "Mensaje creado exitosamente",
            payload: null
        }

    })

}