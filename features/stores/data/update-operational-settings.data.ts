import { PaymentMethod } from "@prisma/client"

import { prisma } from "@/utils/prisma"

type UpdateOperationalSettingsPayload = {
    offers_delivery: boolean
    delivery_price: number
    free_delivery_minimum: number | null
    delivery_radius_km: number
    payment_methods: PaymentMethod[]
    minimum_order_amount: number
}

export async function updateOperationalSettingsData(storeId: number, payload: UpdateOperationalSettingsPayload) {
    // Check if operational settings exist for this store
    const existingSettings = await prisma.storeOperationalSettings.findUnique({
        where: { store_id: storeId }
    })

    if (existingSettings) {
        // Update existing settings
        const updatedSettings = await prisma.storeOperationalSettings.update({
            where: { store_id: storeId },
            data: {
                offers_delivery: payload.offers_delivery,
                delivery_price: payload.delivery_price,
                free_delivery_minimum: payload.free_delivery_minimum,
                delivery_radius_km: payload.delivery_radius_km,
                payment_methods: payload.payment_methods,
                minimum_order_amount: payload.minimum_order_amount,
                updated_at: new Date()
            }
        })

        return {
            hasError: false,
            message: "Operational settings updated successfully",
            payload: updatedSettings
        }
    } else {
        // Create new settings if they don't exist
        const newSettings = await prisma.storeOperationalSettings.create({
            data: {
                store_id: storeId,
                offers_delivery: payload.offers_delivery,
                delivery_price: payload.delivery_price,
                free_delivery_minimum: payload.free_delivery_minimum,
                delivery_radius_km: payload.delivery_radius_km,
                payment_methods: payload.payment_methods,
                minimum_order_amount: payload.minimum_order_amount
            }
        })

        return {
            hasError: false,
            message: "Operational settings created successfully",
            payload: newSettings
        }
    }
} 