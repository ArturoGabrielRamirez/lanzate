"use server"

import { actionWrapper } from "@/features/global/utils"
import { getLogDetailsById } from "@/features/stores/data/getLogDetailsById"

export async function getLogDetailsAction(id: string) {
    return actionWrapper(async () => {

        const { error, payload, message } = await getLogDetailsById(parseInt(id))

        if (error) throw new Error(message)

        return {
            hasError: false,
            message: "Log details retrieved successfully",
            payload: payload
        }

    })
} 