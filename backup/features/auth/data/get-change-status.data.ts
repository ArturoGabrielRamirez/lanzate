"use server"

import { PrismaUserId } from "@/features/auth/types"
import { prisma } from "@/utils/prisma"

export async function getChangeStatusData({ userId }: PrismaUserId) {
    const changeRequest = await prisma.email_change_requests.findFirst({
        where: {
            user_id: userId,
            completed: false,
            expires_at: {
                gt: new Date()
            }
        },
        orderBy: {
            created_at: 'desc'
        }
    })
    if (!changeRequest) {
        return {
            hasError: false,
            message: "No hay solicitud de cambio de email pendiente",
            payload: null
        }
    }

    return {
        hasError: false,
        message: "Estado de cambio de email obtenido",
        payload: changeRequest
    }
}