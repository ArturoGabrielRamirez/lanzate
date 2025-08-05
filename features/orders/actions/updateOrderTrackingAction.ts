"use server"

import { updateOrderTrackingData } from "../data/updateOrderTrackingData"
import { OrderTrackingStatus } from "@prisma/client"

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

        return result
    } catch (error) {
        console.error("Error updating order tracking:", error)
        return {
            error: true,
            message: "Failed to update order tracking"
        }
    }
} 