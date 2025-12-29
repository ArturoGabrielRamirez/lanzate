"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { finalizeOrderData } from "@/features/orders/data/finalize-order.data"
import { FinalizeOrderActionProps } from "@/features/orders/types"

export async function finalizeOrderAction({
    orderId,
    shippingMethod
}: FinalizeOrderActionProps) {
    return actionWrapper(async () => {
        const result = await finalizeOrderData({
            orderId: parseInt(orderId),
            shippingMethod
        })

        if (!result.hasError) {
            revalidatePath(`/dashboard/orders/${orderId}`)
        }

        return {
            payload: result.payload,
            hasError: result.hasError,
            message: result.message
        }
    })
} 