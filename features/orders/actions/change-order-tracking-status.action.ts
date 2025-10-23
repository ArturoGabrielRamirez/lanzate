"use server"

import { OrderTrackingStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { changeOrderTrackingStatusData } from "@/features/orders/data/change-order-tracking-status.data"

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
    return actionWrapper(async () => {
        const result = await changeOrderTrackingStatusData({
            orderId,
            newStatus
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
