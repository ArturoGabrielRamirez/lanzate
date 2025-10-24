"use server"

import { UpdateCompleteSupabaseProcessParams } from "@/features/auth/types"
import { prisma } from "@/utils/prisma"

export async function updateCompleteSupabaseProcessData({ localUser, changeRequest }: UpdateCompleteSupabaseProcessParams) {
    if (!changeRequest) {
        return {
            hasError: false,
            message: "No hay solicitud de cambio de email pendiente",
            payload: null
        }
    }
    await prisma.email_change_requests.update({
        where: { id: changeRequest.id },
        data: {
            completed: true,
            completed_at: new Date(),
            new_email_confirmed: true,
            new_email_confirmed_at: new Date()
        }
    })

    await prisma.user.update({
        where: { id: localUser.payload?.id },
        data: {
            email: changeRequest?.new_email,
            updated_at: new Date()
        }
    })

    return {
        hasError: false,
        message: "Estado de cambio de email obtenido",
        payload: {
            currentEmail: changeRequest?.new_email,
            newEmail: null,
            emailConfirmed: true,
            hasEmailChange: false,
            processCompleted: true,
            oldEmailConfirmed: true,
            newEmailConfirmed: true,
            changeWasCancelled: false
        }
    }
}