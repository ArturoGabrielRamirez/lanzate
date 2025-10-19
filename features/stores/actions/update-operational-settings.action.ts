"use server"

import { PaymentMethod } from "@prisma/client"
import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { updateOperationalSettings } from "@/features/stores/data/updateOperationalSettings"

type UpdateOperationalSettingsActionPayload = {
    offers_delivery: boolean
    delivery_price: number
    free_delivery_minimum: number | null
    delivery_radius_km: number
    payment_methods: PaymentMethod[]
    minimum_order_amount: number
}

export async function updateOperationalSettingsAction(storeId: number, payload: UpdateOperationalSettingsActionPayload) {
    return actionWrapper(async () => {
        const { error, payload: updatedPayload, message } = await updateOperationalSettings(storeId, payload)

        if (error) throw new Error(message)

        revalidatePath(`/stores/${storeId}/account`)

        return {
            message: "Operational settings updated successfully",
            payload: updatedPayload,
            hasError: false
        }
    })
} 