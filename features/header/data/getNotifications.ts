"use server"

import { PrismaClient } from "@/prisma/generated/prisma"
import { formatErrorResponse } from "@/utils/lib"

export const getNotifications = async (userId: number) => {

    try {

        const client = new PrismaClient()

        const notifications = await client.notification.findMany({
            where: {
                user_id: userId
            }
        })

        return {
            message: "Notifications fetched successfully from db",
            payload: notifications,
            error: false
        }

    } catch (error) {
        return formatErrorResponse("Error fetching notifications from db", error)
    }
}
