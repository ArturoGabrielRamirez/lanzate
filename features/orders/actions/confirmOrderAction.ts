"use server"

import { confirmOrderData } from "../data/confirmOrderData"

type ConfirmOrderActionProps = {
    orderId: string
}

export async function confirmOrderAction({ orderId }: ConfirmOrderActionProps) {
    try {
        const result = await confirmOrderData({ 
            orderId: parseInt(orderId) 
        })

        return result
    } catch (error) {
        console.error("Error confirming order:", error)
        return {
            error: true,
            message: "Failed to confirm order"
        }
    }
} 