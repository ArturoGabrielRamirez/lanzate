"use server"

import { formatErrorResponse } from "@/utils/lib"
import { insertNotification } from "../data/insertNotification"

export async function sendNotification() {
    try {

        const { error, payload, message } = await insertNotification("Cuchaaaaa")

        if (error) throw new Error(message)

        return {
            message: "Notification sent successfully",
            payload: payload,
            error: false
        }

    } catch (error) {
        return formatErrorResponse("Error sending notification", error)
    }
}
