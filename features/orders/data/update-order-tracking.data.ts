import { OrderTrackingStatus } from "@prisma/client"

import { formatSuccessResponse } from "@/features/global/utils"
import { prisma } from "@/utils/prisma"

type UpdateOrderTrackingDataProps = {
    orderId: number
    newTrackingStatus: OrderTrackingStatus
}

export async function updateOrderTrackingData({ 
    orderId, 
    newTrackingStatus 
}: UpdateOrderTrackingDataProps) {
    // Update order tracking status
    const updatedTracking = await prisma.orderTracking.update({
        where: { order_id: orderId },
        data: { 
            tracking_status: newTrackingStatus,
            updated_at: new Date()
        }
    })

    return formatSuccessResponse("Order tracking updated successfully", updatedTracking)
} 