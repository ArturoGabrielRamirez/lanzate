"use server"

import { getDashboardStatsData } from "@/features/dashboard/data"
import { actionWrapper } from "@/features/global/utils"

export async function getDashboardStatsAction(userId: number) {
    return actionWrapper(async () => {

        const stats = await getDashboardStatsData(userId)

        return {
            message: "Dashboard stats retrieved successfully",
            payload: stats,
            hasError: false
        }
    })
} 