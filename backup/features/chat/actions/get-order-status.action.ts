"use server"

import { getOrderStatusData } from "@/features/chat/data/get-order-status.data"
import { OrderIdProp } from "@/features/chat/types"
import { actionWrapper } from '@/features/global/utils'

export async function fetchOrderStatusAction({ orderId }: OrderIdProp) {
    return actionWrapper(async () => {
        const order = await getOrderStatusData({ orderId })

        return {
            hasError: false,
            message: "Estado del pedido recuperado exitosamente",
            payload: order
        }
    })
}
