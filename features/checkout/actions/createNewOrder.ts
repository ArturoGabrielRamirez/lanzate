"use server"

import { formatErrorResponse } from "@/utils/lib"
import { insertNewOrder } from "../data/insertNewOrder"

export async function createNewOrder(formData: any, cart: any[], shippingMethod: "delivery" | "pickup", subdomain: string, userId: string) {
    console.log("🚀 ~ createNewOrder ~ formData:", formData)
    console.log("🚀 ~ createNewOrder ~ cart:", cart)
    console.log("🚀 ~ createNewOrder ~ shippingMethod:", shippingMethod)
    console.log("🚀 ~ createNewOrder ~ subdomain:", subdomain)
    console.log("🚀 ~ createNewOrder ~ userId:", userId)
    try {

        await insertNewOrder(formData, cart, shippingMethod, subdomain, userId)

        return {
            error: false,
            message: "Order created successfully",
            payload: null
        }

    } catch (error) {
        return formatErrorResponse("Error creating new order", error)
    }
}

