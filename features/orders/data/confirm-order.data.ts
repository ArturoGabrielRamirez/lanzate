import { prisma } from "@/utils/prisma"

type ConfirmOrderDataProps = {
    orderId: number
}

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
        message: "Order confirmed successfully",
        payload: {
            order: updatedOrder,
            tracking: orderTracking
        }
    }
} 