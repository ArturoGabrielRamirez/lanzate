'use server'

import { actionWrapper, formatErrorResponse, formatSuccessResponse } from "@/features/global/utils"
import { searchGlobalData } from "@/features/global-search/data"

export async function searchGlobalAction(query: string, userId: number) {
    return actionWrapper(async () => {
        
        const { hasError, payload, message } = await searchGlobalData(query, userId)

        if (hasError) {
            return formatErrorResponse(message)
        }

        return formatSuccessResponse(message, payload)
    })
} 