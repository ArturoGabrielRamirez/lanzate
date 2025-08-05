import { prisma } from "@/utils/prisma"
import { actionWrapper } from "@/utils/lib"

type FinalizeOrderDataProps = {
    orderId: number
    shippingMethod: "PICKUP" | "DELIVERY"
}

export async function finalizeOrderData({ 
    orderId, 
    shippingMethod 
}: FinalizeOrderDataProps) {
    return actionWrapper(async () => {
        // Determine the final tracking status based on shipping method
        const finalTrackingStatus = shippingMethod === "PICKUP" ? "PICKED_UP" : "DELIVERED"

        // Update order status to COMPLETED
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status: "COMPLETED" }
        })

        // Update order tracking status
        const updatedTracking = await prisma.orderTracking.update({
            where: { order_id: orderId },
            data: { 
                tracking_status: finalTrackingStatus,
                updated_at: new Date()
            }
        })

        return {
            error: false,
            message: "Order finalized successfully",
            payload: {
                order: updatedOrder,
                tracking: updatedTracking
            }
        }
    })
} 