"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper, formatSuccessResponse } from "@/features/global/utils"
import { confirmOrderData } from "@/features/orders/data/confirm-order.data"
import { ConfirmOrderActionProps } from "@/features/orders/types"

export async function confirmOrderAction({ orderId }: ConfirmOrderActionProps) {
    return actionWrapper(async () => {
        const result = await confirmOrderData({
            orderId: parseInt(orderId)
        })

        revalidatePath("/dashboard")
        revalidatePath("/stores")

        return formatSuccessResponse(result.message, result.payload)
    })
} 