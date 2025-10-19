"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { updateOperationalSettingsData } from "@/features/stores/data"
import { UpdateOperationalSettingsPayload } from "@/features/stores/types"

export async function updateOperationalSettingsAction(storeId: number, payload: UpdateOperationalSettingsPayload) {
    return actionWrapper(async () => {
        const { hasError, payload: updatedPayload, message } = await updateOperationalSettingsData(storeId, payload)

        if (hasError || !updatedPayload) throw new Error(message)

        revalidatePath(`/stores/${storeId}/account`)

        return {
            message: "Operational settings updated successfully",
            payload: updatedPayload,
            hasError: false
        }
    })
} 