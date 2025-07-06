"use server"

import { PrismaClient } from "@/prisma/generated/prisma"


export async function insertNotification(message: string) {
    try {

        const prisma = new PrismaClient()

        const notification = await prisma.notification.create({
            data: {
                message: "Cuchaaaa",
                title: "Nueva notificacion nenita!",
                type: "notification",
                user_id: 2
            }
        })

        return {
            message: "Notification created successfully",
            payload: notification,
            error: false
        }

    } catch (error) {

        const errorResponse = {
            message: "Error creating notification",
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