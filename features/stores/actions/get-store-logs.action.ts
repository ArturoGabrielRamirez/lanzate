"use server"

import { actionWrapper } from "@/features/global/utils"
import { getStoreLogsBySlug } from "@/features/stores/data/getStoreLogsBySlug"

export async function getStoreLogsAction(slug: string) {
    return actionWrapper(async () => {

        const { error, payload, message } = await getStoreLogsBySlug(slug)

        if (error) throw new Error(message)

        return {
            hasError: false,
            message: "Store logs retrieved successfully",
            payload: payload
        }

    })
} 