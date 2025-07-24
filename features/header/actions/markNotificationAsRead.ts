"use server"

import { actionWrapper } from "@/utils/lib"
import { updateNotificationRead } from "../data/updateNotificationRead"
import { insertLogEntry } from "@/features/layout/data/insertLogEntry"

export const markNotificationAsRead = async (id: number, userId: number) => {

    return actionWrapper(async () => {

        const { error, message, payload } = await updateNotificationRead(id)

        if (error) throw new Error(message)

        // Create action log - using USER entity since notifications are user-related
        const { error: logError } = await insertLogEntry({
            action: "UPDATE",
            entity_type: "USER",
            entity_id: userId,
            user_id: userId,
            action_initiator: "Notification click",
            details: `Notification ${id} marked as read`
        })

        if (logError) throw new Error("The action went through but there was an error creating a log entry for this.")

        return {
            message: "Notification read successfully",
            payload: payload,
            error: false
        }

    })
}
