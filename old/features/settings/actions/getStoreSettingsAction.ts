"use server"

import { getStoreSettings } from "@/features/settings/data/getStoreSettings"
import { getStoresFromSlug } from "@/features/stores/actions/getStoresFromSlug"

export async function getStoreSettingsAction(slug: string) {
    const { payload: store, error } = await getStoresFromSlug(slug)
    
    if (error || !store) {
        return {
            message: "Store not found",
            error: true,
            payload: null
        }
    }

    return await getStoreSettings(store.id)
} 