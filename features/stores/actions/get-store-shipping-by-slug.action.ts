"use server"

import { actionWrapper } from "@/features/global/utils"
import { selectStoreShippingBySlugData } from "@/features/stores/data/select-store-shipping-by-slug.data"

export async function getStoreShippingBySlugAction(slug: string) {
    return actionWrapper(async () => {
        return await selectStoreShippingBySlugData(slug)
    })
}

