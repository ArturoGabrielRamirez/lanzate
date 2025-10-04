"use server"

import { actionWrapper } from "@/utils/lib"
import { getSocialActivityById } from "../data/getSocialActivityById"

export async function getSocialActivityByIdAction(activityId: number) {
    return actionWrapper(async () => {
        if (!activityId) {
            throw new Error("Activity ID is required")
        }

        const { error, payload, message } = await getSocialActivityById(activityId)

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