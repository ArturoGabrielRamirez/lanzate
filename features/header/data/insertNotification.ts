"use server"

import { PrismaClient } from "@/prisma/generated/prisma"
import { formatErrorResponse } from "@/utils/lib"


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
        return formatErrorResponse("Error creating notification", error)
    }
}