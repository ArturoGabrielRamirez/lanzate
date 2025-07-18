"use server"

import { formatErrorResponse } from "@/utils/lib"

export async function createNewOrder(formData: any, cart: any[], shippingMethod: "delivery" | "pickup") {
    console.log("🚀 ~ createNewOrder ~ formData:", formData)
    console.log("🚀 ~ createNewOrder ~ cart:", cart)
    console.log("🚀 ~ createNewOrder ~ shippingMethod:", shippingMethod)
    try {


        return {
            error: false,
            message: "Order created successfully",
            payload: null
        }

    } catch (error) {
        return formatErrorResponse("Error creating new order", error)
    }
}

