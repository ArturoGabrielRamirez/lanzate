"use server"

import { finalizeOrderData } from "../data/finalize-order.data"
import { revalidatePath } from "next/cache"

type FinalizeOrderActionProps = {
    orderId: string
    shippingMethod: "PICKUP" | "DELIVERY"
}

export async function finalizeOrderAction({ 
    orderId, 
    shippingMethod 
}: FinalizeOrderActionProps) {
    try {
        const result = await finalizeOrderData({ 
            orderId: parseInt(orderId),
            shippingMethod
        })

        if (!result.error) {
            revalidatePath(`/dashboard/orders/${orderId}`)
        }

        return result
    } catch (error) {
        console.error("Error finalizing order:", error)
        return {
            error: true,
            message: "Failed to finalize order"
        }
    }
} 