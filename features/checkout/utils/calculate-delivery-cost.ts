import { ShippingMethod } from "@prisma/client"

/**
 * Calculates the delivery cost based on shipping method and operational settings
 * @param offersDelivery - Whether the store offers delivery
 * @param shippingMethod - The selected shipping method
 * @param deliveryPrice - The base delivery price from store settings
 * @returns The calculated delivery cost
 */
export function calculateDeliveryCost(
    offersDelivery: boolean,
    shippingMethod: ShippingMethod,
    deliveryPrice: number
): number {
    return offersDelivery && shippingMethod === "DELIVERY" ? deliveryPrice : 0
}
