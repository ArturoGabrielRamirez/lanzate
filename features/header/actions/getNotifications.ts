"use server"

import { actionWrapper } from "@/utils/lib"
import { getNotifications as getNotificationsFromDb } from "../data/getNotifications"

export const getNotifications = async () => {

    return actionWrapper(async () => {

        const { payload, error, message } = await getNotificationsFromDb(1)

        if (error) throw new Error(message)

        return {
            message: "Notifications fetched successfully",
            payload: payload,
            error: false
        }

    })

}
