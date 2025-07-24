"use server"

import { updateStoreSettings } from "@/features/settings/data/updateStoreSettings"
import { getStoresFromSlug } from "@/features/stores/actions/getStoresFromSlug"
import { StoreCustomizationForm } from "@/features/settings/types"
import { ResponseType } from "@/features/layout/types"
import { revalidatePath } from "next/cache"

export async function updateStoreSettingsAction(slug: string, settings: StoreCustomizationForm): Promise<ResponseType<StoreCustomizationForm>> {
    const { payload: store, error } = await getStoresFromSlug(slug)
    
    if (error || !store) {
        return {
            message: "Store not found",
            error: true,
            payload: settings
        }
    }

    const result = await updateStoreSettings(store.id, settings)
    
    if (!result.error) {
        revalidatePath(`/stores/${slug}/settings`)
        revalidatePath(`/s/${store.subdomain}`)
    }
    
    return {
        message: result.message,
        error: result.error,
        payload: settings
    }
} 