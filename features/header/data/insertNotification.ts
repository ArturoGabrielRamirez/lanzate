"use server"

import { PrismaClient } from "@/prisma/generated/prisma"


export async function insertNotification(message: string) {
    try {

        const prisma = new PrismaClient()

        const notification = await prisma.notification.create({
            data : {
                message : "Cuchaaaa",
                title : "Nueva notificacion nenita!",
                type : "notification",
                user_id : 2
            }
        })

        return notification

    } catch (error) {
        console.error(error)
    }
}