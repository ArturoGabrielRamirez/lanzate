"use server"

import { OrderTrackingStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { updateOrderTrackingData } from "@/features/orders/data/update-order-tracking.data"

type UpdateOrderTrackingActionProps = {
    orderId: string
    newTrackingStatus: OrderTrackingStatus
}

export async function updateOrderTrackingAction({
    orderId,
    newTrackingStatus
}: UpdateOrderTrackingActionProps) {
    return actionWrapper(async () => {
        const result = await updateOrderTrackingData({
            orderId: parseInt(orderId),
            newTrackingStatus
        })

        if (!result.error) {
            revalidatePath(`/dashboard/orders/${orderId}`)
        }

        return {
            payload: result.payload,
            hasError: result.error,
            message: result.message
        }
    })
} 