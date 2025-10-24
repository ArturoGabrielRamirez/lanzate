"use server"

import { ChangeOrderTrackingStatusProps } from "@/features/orders/types"
import { prisma } from "@/utils/prisma"

export async function changeOrderTrackingStatusData({
    orderId,
    newStatus
}: ChangeOrderTrackingStatusProps) {
    // Update order tracking status
    const updatedTracking = await prisma.orderTracking.update({
        where: { order_id: orderId },
        data: {
            tracking_status: newStatus.newStatus,
            updated_at: new Date()
        }
    })

    return {
        hasError: false,
        message: "Order tracking status changed successfully",
        payload: updatedTracking
    }
}
