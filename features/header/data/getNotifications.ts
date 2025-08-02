"use server"

/* import { PrismaClient } from '@prisma/client' */
import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export const getNotifications = async (userId: number) => {
    return actionWrapper(async () => {

        /* const client = new PrismaClient() */

        const notifications = await prisma.notification.findMany({
            where: {
                user_id: userId,
                read: false
            }
        })

        return {
            message: "Notifications fetched successfully from db",
            payload: notifications,
            error: false
        }

    })
}
