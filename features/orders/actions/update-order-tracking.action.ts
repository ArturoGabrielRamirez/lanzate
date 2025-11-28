"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper, formatSuccessResponse } from "@/features/global/utils"
import { updateOrderTrackingData } from "@/features/orders/data/update-order-tracking.data"
import { UpdateOrderTrackingActionProps } from "@/features/orders/types"

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

        return formatSuccessResponse("Seguimiento de la orden actualizado con éxito", result)
    })
}