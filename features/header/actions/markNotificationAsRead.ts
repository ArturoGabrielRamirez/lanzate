"use server"

import { formatErrorResponse } from "@/utils/lib"
import { updateNotificationRead } from "../data/updateNotificationRead"

export const markNotificationAsRead = async (id: number) => {

    try {

        const { error, message, payload } = await updateNotificationRead(id)

        if (error) throw new Error(message)

        return {
            message: "Notification read successfully",
            payload: payload,
            error: false
        }

    } catch (error) {
        return formatErrorResponse("Error marking notification as read", error)
    }
}
