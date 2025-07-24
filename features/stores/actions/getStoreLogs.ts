"use server"

import { actionWrapper } from "@/utils/lib"
import { getStoreLogsBySlug } from "../data/getStoreLogsBySlug"

export async function getStoreLogs(slug: string) {
    return actionWrapper(async () => {

        const { error, payload, message } = await getStoreLogsBySlug(slug)

        if (error) throw new Error(message)

        return {
            error: false,
            message: "Store logs retrieved successfully",
            payload: payload
        }

    })
} 