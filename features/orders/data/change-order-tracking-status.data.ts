import { OrderTrackingStatus } from "@prisma/client"

import { prisma } from "@/utils/prisma"

type ChangeOrderTrackingStatusProps = {
    orderId: number
    newStatus: {
        newStatus: OrderTrackingStatus
    }
}

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
