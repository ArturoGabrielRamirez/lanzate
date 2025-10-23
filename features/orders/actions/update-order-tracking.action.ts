"use server"

import { updateOrderTrackingData } from "../data/update-order-tracking.data"
import { OrderTrackingStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

type UpdateOrderTrackingActionProps = {
    orderId: string
    newTrackingStatus: OrderTrackingStatus
}

export async function updateOrderTrackingAction({ 
    orderId, 
    newTrackingStatus 
}: UpdateOrderTrackingActionProps) {
    try {
        const result = await updateOrderTrackingData({ 
            orderId: parseInt(orderId),
            newTrackingStatus
        })

        if (!result.error) {
            revalidatePath(`/dashboard/orders/${orderId}`)
        }

        return result
    } catch (error) {
        console.error("Error updating order tracking:", error)
        return {
            error: true,
            message: "Failed to update order tracking"
        }
    }
} 