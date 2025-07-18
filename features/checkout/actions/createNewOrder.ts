"use server"

import { formatErrorResponse } from "@/utils/lib"
import { insertNewOrder } from "../data/insertNewOrder"

export async function createNewOrder(formData: any, cart: any[], shippingMethod: "delivery" | "pickup", subdomain: string, userId: string) {

    try {

        const { error: insertError, payload: order, message: insertMessage } = await insertNewOrder(formData, cart, shippingMethod, subdomain, userId)

        if (insertError) throw new Error(insertMessage)

        return {
            error: false,
            message: "Order created successfully",
            payload: order
        }

    } catch (error) {
        return formatErrorResponse("Error creating new order", error)
    }
}

