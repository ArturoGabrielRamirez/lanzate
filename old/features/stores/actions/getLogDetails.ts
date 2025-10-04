"use server"

import { actionWrapper } from "@/utils/lib"
import { getLogDetailsById } from "../data/getLogDetailsById"

export async function getLogDetails(id: string) {
    return actionWrapper(async () => {

        const { error, payload, message } = await getLogDetailsById(parseInt(id))

        if (error) throw new Error(message)

        return {
            error: false,
            message: "Log details retrieved successfully",
            payload: payload
        }

    })
} 