"use server"

import { OrderTrackingStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

import { actionWrapper, formatSuccessResponse } from "@/features/global/utils"
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
        const { payload: result, hasError: hasError, message: message } = await updateOrderTrackingData({
            orderId: parseInt(orderId),
            newTrackingStatus
        })

        if (hasError) throw new Error(message)

        revalidatePath(`/dashboard/orders/${orderId}`)

        return formatSuccessResponse("Order tracking updated successfully", result)
    })
}