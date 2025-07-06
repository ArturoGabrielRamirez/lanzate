"use server"

import { formatErrorResponse } from "@/utils/lib"
import { getNotifications as getNotificationsFromDb } from "../data/getNotifications"

export const getNotifications = async () => {

    try {

        const { payload, error, message } = await getNotificationsFromDb(1)

        if (error) throw new Error(message)

        return {
            message: "Notifications fetched successfully",
            payload: payload,
            error: false
        }

    } catch (error) {
        return formatErrorResponse("Error fetching notifications", error)
    }

}
