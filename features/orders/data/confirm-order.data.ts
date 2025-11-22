"use server"

import { ConfirmOrderDataProps } from "@/features/orders/types"
import { prisma } from "@/utils/prisma"

export async function confirmOrderData({ orderId }: ConfirmOrderDataProps) {
    // Update order status to READY
    const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status: "READY" }
    })

    // Create order tracking record
    const orderTracking = await prisma.orderTracking.create({
        data: {
            order_id: orderId,
            tracking_status: "PREPARING_ORDER"
        }
    })

    return {
        hasError: false,
        message: "Pedido confirmado con éxito",
        payload: {
            order: updatedOrder,
            tracking: orderTracking
        }
    }
} 