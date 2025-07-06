"use server"

import { PrismaClient } from "@/prisma/generated/prisma"
import { formatErrorResponse } from "@/utils/lib"

export const updateNotificationRead = async (id: number) => {
    try {

        const client = new PrismaClient()

        const notification = await client.notification.update({
            where: {
                id: id
            },
            data: {
                read: true
            }
        })

        return {
            message: "Notification read successfully",
            payload: notification,
            error: false
        }

    } catch (error) {
        return formatErrorResponse("Error updating notification read", error)
    }
}
