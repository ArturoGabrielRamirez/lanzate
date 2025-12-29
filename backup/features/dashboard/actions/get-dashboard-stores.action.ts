"use server"

import { selectDashboardStoresData } from "@/features/dashboard/data"
import { actionWrapper } from "@/features/global/utils"

export async function getDashboardStoresAction(userId: number, limit?: number) {
    return await actionWrapper(async () => {

        const { error, payload, message } = await selectDashboardStoresData(userId, limit)

        if (error) throw new Error(message)

        return {
            message: message,
            payload: payload,
            hasError: false
        }
    })
} 