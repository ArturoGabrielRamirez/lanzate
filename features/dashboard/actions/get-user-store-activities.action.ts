"use server"

import { selectUserStoreActivitiesData } from "@/features/dashboard/data"
import { actionWrapper } from "@/features/global/utils"

export async function getUserStoreActivitiesAction(userId: number, type: string, page: number) {
    return actionWrapper(async () => {

        if (!userId) {
            throw new Error("User ID is required")
        }

        const { payload } = await selectUserStoreActivitiesData(userId, type, page)

        return {
            message: "User store activities fetched successfully",
            payload: payload,
            hasError: false
        }
    })
} 