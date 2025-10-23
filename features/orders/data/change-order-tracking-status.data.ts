import { prisma } from "@/utils/prisma"
import { actionWrapper } from "@/utils/lib"
import { OrderTrackingStatus } from "@prisma/client"

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
    return actionWrapper(async () => {
        // Update order tracking status
        const updatedTracking = await prisma.orderTracking.update({
            where: { order_id: orderId },
            data: { 
                tracking_status: newStatus.newStatus,
                updated_at: new Date()
            }
        })

        return {
            error: false,
            message: "Order tracking status changed successfully",
            payload: updatedTracking
        }
    })
}
