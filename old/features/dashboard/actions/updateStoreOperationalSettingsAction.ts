"use server"

import { updateStoreOperationalSettings } from "@/features/dashboard/data/updateStoreOperationalSettings"
import { StoreOperationalSettingsForm } from "@/features/dashboard/types/operational-settings"
import { ResponseType } from "@/features/layout/types"
import { revalidatePath } from "next/cache"

export async function updateStoreOperationalSettingsAction(
    storeId: number, 
    settings: StoreOperationalSettingsForm
): Promise<ResponseType<StoreOperationalSettingsForm>> {
    const result = await updateStoreOperationalSettings(storeId, settings)
    
    if (!result.error) {
        revalidatePath(`/dashboard`)
        revalidatePath(`/stores`)
    }
    
    return {
        message: result.message,
        error: result.error,
        payload: settings
    }
} 