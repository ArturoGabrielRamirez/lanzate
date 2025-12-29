"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper, formatSuccessResponse } from "@/features/global/utils"
import { changeOrderTrackingStatusData } from "@/features/orders/data/change-order-tracking-status.data"
import { ChangeOrderTrackingStatusActionProps } from "@/features/orders/types"

export async function changeOrderTrackingStatusAction({
    orderId,
    newStatus
}: ChangeOrderTrackingStatusActionProps) {
    return actionWrapper(async () => {

        const { payload: updatedTracking, hasError, message } = await changeOrderTrackingStatusData({
            orderId,
            newStatus
        })

        if (hasError) throw new Error(message)

        revalidatePath(`/dashboard/orders/${orderId}`)

        return formatSuccessResponse(message, updatedTracking)
    })
}
