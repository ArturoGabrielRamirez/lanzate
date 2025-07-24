"use server"

import { actionWrapper } from "@/utils/lib"
import { insertNewOrder } from "../data/insertNewOrder"
import { insertLogEntry } from "@/features/layout/data/insertLogEntry"

export async function createNewOrder(formData: any, cart: any[], shippingMethod: "delivery" | "pickup", subdomain: string, userId: string) {

    return actionWrapper(async () => {

        const { error: insertError, payload: order, message: insertMessage } = await insertNewOrder(formData, cart, shippingMethod, subdomain, userId)

        if (insertError) throw new Error(insertMessage)

        // Create action log
        const { error: logError } = await insertLogEntry({
            action: "CREATE",
            entity_type: "ORDER",
            entity_id: order.id,
            user_id: parseInt(userId),
            action_initiator: "Checkout form",
            details: "Order created using checkout form"
        })

        if (logError) throw new Error("The action went through but there was an error creating a log entry for this.")

        return {
            error: false,
            message: "Order created successfully",
            payload: order
        }

    })
}

