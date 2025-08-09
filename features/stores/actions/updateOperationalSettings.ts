"use server"

import { updateOperationalSettings } from "../data/updateOperationalSettings"
import { actionWrapper } from "@/utils/lib"
import { revalidatePath } from "next/cache"
import { PaymentMethod } from "@prisma/client"

type UpdateOperationalSettingsActionPayload = {
    offers_delivery: boolean
    delivery_price: number
    free_delivery_minimum: number | null
    delivery_radius_km: number
    payment_methods: PaymentMethod[]
    minimum_order_amount: number
}

export async function updateOperationalSettingsAction(
    storeId: number,
    payload: UpdateOperationalSettingsActionPayload
) {
    return actionWrapper(async () => {
        const result = await updateOperationalSettings(storeId, payload)
        
        // Revalidate the store account page to reflect the changes
        revalidatePath(`/stores/${storeId}/account`)
        
        return result
    })
} 