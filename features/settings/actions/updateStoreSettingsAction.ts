"use server"

import { updateStoreSettings } from "@/features/settings/data/updateStoreSettings"
import { getStoresFromSlug } from "@/features/stores/actions/get-stores-from-slug.action"
import { StoreCustomization } from "@prisma/client"
import { ResponseType } from "@/features/layout/types"
import { revalidatePath } from "next/cache"

export async function updateStoreSettingsAction(slug: string, settings: StoreCustomization): Promise<ResponseType<StoreCustomization>> {
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