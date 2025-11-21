"use server"

import { FinalizeOrderDataProps } from "@/features/orders/types"
import { prisma } from "@/utils/prisma"

export async function finalizeOrderData({
    orderId,
    shippingMethod
}: FinalizeOrderDataProps) {
    // Determine the final tracking status based on shipping method
    const finalTrackingStatus = shippingMethod === "PICKUP" ? "PICKED_UP" : "DELIVERED"

    // Update order status to COMPLETED
    const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
            status: "COMPLETED",
            tracking: {
                update: {
                    where: {
                        order_id: orderId
                    },
                    data: {
                        tracking_status: finalTrackingStatus,
                        updated_at: new Date()
                    }
                }
            }
        },
        include: {
            tracking: true
        }
    })

    return {
        hasError: false,
        message: "Pedido finalizado con éxito",
        payload: {
            order: updatedOrder,
            tracking: updatedOrder.tracking
        }
    }
} 