import { BranchShippingMethod } from "@prisma/client"

import { ShippingFormType } from "@/features/stores/schemas"

export function reverseMapShippingMethods(methods: BranchShippingMethod[]): ShippingFormType["shipping_info"]["methods"] {
    if (!methods || methods.length === 0) return []

    const groupedMethods = new Map<string, {
        providers: string[]
        minPurchase: string
        freeShippingMin: string
        deliveryPrice: string
        estimatedTime: string
    }>()

    methods.forEach(method => {
        // Create a unique key based on the pricing rules
        // We don't have ETA in DB so we ignore it for grouping or keying
        const minPurchase = method.min_order_amount?.toString() || ""
        const freeShippingMin = method.free_shipping_min?.toString() || ""
        const deliveryPrice = method.delivery_price?.toString() || ""

        const key = `${minPurchase}-${freeShippingMin}-${deliveryPrice}`

        if (groupedMethods.has(key)) {
            const existing = groupedMethods.get(key)!
            existing.providers.push(method.provider)
        } else {
            groupedMethods.set(key, {
                providers: [method.provider],
                minPurchase,
                freeShippingMin,
                deliveryPrice,
                estimatedTime: "00:00" // Default since not persisted
            })
        }
    })

    return Array.from(groupedMethods.values())
}

