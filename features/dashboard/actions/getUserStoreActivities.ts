"use server"

import { actionWrapper } from "@/utils/lib"
import { selectUserStoreActivities } from "../data/selectUserStoreActivities"

export async function getUserStoreActivities(userId: number, type: string) {
    return actionWrapper(async () => {

        if (!userId) {
            throw new Error("User ID is required")
        }

        const { error, payload, message } = await selectUserStoreActivities(userId, type)
        console.log("🚀 ~ getUserStoreActivities ~ payload:", payload)

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