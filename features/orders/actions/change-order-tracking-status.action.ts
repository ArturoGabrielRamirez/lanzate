"use server"

import { changeOrderTrackingStatusData } from "../data/change-order-tracking-status.data"
import { OrderTrackingStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

type ChangeOrderTrackingStatusActionProps = {
    orderId: number
    newStatus: {
        newStatus: OrderTrackingStatus
    }
}

export async function changeOrderTrackingStatusAction({ 
    orderId, 
    newStatus 
}: ChangeOrderTrackingStatusActionProps) {
    try {
        const result = await changeOrderTrackingStatusData({ 
            orderId,
            newStatus
        })

        if (!result.error) {
            revalidatePath(`/dashboard/orders/${orderId}`)
        }

        return result
    } catch (error) {
        console.error("Error changing order tracking status:", error)
        return {
            error: true,
            message: "Failed to change order tracking status"
        }
    }
}
