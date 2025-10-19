"use server"

import { actionWrapper } from "@/features/global/utils"
import { getLogDetailsByIdData } from "@/features/stores/data/get-log-details-by-id.data"

export async function getLogDetailsAction(id: string) {
    return actionWrapper(async () => {

        const { hasError, message, payload } = await getLogDetailsByIdData(parseInt(id))

        if (hasError) throw new Error(message)

        return {
            message: message,
            payload: payload,
            hasError: hasError
        }
    })
}