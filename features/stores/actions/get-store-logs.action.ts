"use server"

import { actionWrapper } from "@/features/global/utils"
import { getStoreLogsBySlugData } from "@/features/stores/data/get-store-logs-by-slug.data"

export async function getStoreLogsAction(slug: string) {
    return actionWrapper(async () => {

        const { hasError, message, payload } = await getStoreLogsBySlugData(slug)

        if (hasError) throw new Error(message)

        return {
            hasError: false,
            message: "Store logs retrieved successfully",
            payload: payload
        }

    })
} 