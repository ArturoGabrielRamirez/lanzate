import { prisma } from "@/utils/prisma"
import { actionWrapper } from "@/utils/lib"
import { OrderTrackingStatus } from "@prisma/client"

type UpdateOrderTrackingDataProps = {
    orderId: number
    newTrackingStatus: OrderTrackingStatus
}

export async function updateOrderTrackingData({ 
    orderId, 
    newTrackingStatus 
}: UpdateOrderTrackingDataProps) {
    return actionWrapper(async () => {
        // Update order tracking status
        const updatedTracking = await prisma.orderTracking.update({
            where: { order_id: orderId },
            data: { 
                tracking_status: newTrackingStatus,
                updated_at: new Date()
            }
        })

        return {
            error: false,
            message: "Order tracking updated successfully",
            payload: updatedTracking
        }
    })
} 