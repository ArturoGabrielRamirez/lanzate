"use server"

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
        const errorResponse = {
            message: "Error sending notification",
            payload: null,
            error: true
        }

        if (error instanceof Error) {
            return {
                ...errorResponse,
                message: errorResponse.message + " : " + error.message
            }
        }

        return errorResponse
    }
}
