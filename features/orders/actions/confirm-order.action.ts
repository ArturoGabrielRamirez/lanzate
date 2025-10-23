"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { confirmOrderData } from "@/features/orders/data/confirm-order.data"

type ConfirmOrderActionProps = {
    orderId: string
}

export async function confirmOrderAction({ orderId }: ConfirmOrderActionProps) {
    return actionWrapper(async () => {
        const result = await confirmOrderData({
            orderId: parseInt(orderId)
        })

        revalidatePath("/dashboard")
        revalidatePath("/stores")

        return {
            payload: result.payload,
            hasError: result.error,
            message: result.message
        }
    })
} 