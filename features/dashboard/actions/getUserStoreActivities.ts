"use server"

import { actionWrapper } from "@/utils/lib"
import { selectUserStoreActivities } from "../data/selectUserStoreActivities"

export async function getUserStoreActivities(userId: number, type: string, page: number) {
    return actionWrapper(async () => {

        if (!userId) {
            throw new Error("User ID is required")
        }

        const { error, payload, message } = await selectUserStoreActivities(userId, type, page)

        if (error) {
            throw new Error(message)
        }

        return {
            message: message,
            payload: payload,
            error: false
        }
    })
} 