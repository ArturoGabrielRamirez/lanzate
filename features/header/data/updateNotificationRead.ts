"use server"

/* import { PrismaClient } from '@prisma/client' */
import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export const updateNotificationRead = async (id: number) => {
    return actionWrapper(async () => {

        /* const client = new PrismaClient() */

        const notification = await prisma.notification.update({
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

    })
}
