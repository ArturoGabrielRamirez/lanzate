/* import { ShippingMethod, BranchOperationalSettings } from "@prisma/client"

export function computeDeliveryCost(
    operationalSettings: BranchOperationalSettings | null,
    shippingMethod: ShippingMethod
): number {
    if (!operationalSettings) return 0
    if (!operationalSettings.offers_delivery) return 0
    if (shippingMethod !== "DELIVERY") return 0
    return operationalSettings.delivery_price || 0
}

 */