"use server"

/* import { PrismaClient } from '@prisma/client' */
import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"


export async function insertNotification(message: string) {
    return actionWrapper(async () => {

        /* const prisma = new PrismaClient() */

        const notification = await prisma.notification.create({
            data: {
                message: message,
                title: "Nueva notificacion nenita!",
                type: "notification",
                user_id: 1
            }
        })

        return {
            message: "Notification created successfully",
            payload: notification,
            error: false
        }

    })
}