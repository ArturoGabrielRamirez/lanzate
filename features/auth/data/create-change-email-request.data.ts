"use server"

import { CreateChangeEmailRequestParams } from "@/features/auth/types"
import { prisma } from "@/utils/prisma"

export async function createChangeEmailRequestData({ userId, oldEmail, newEmail, expiresAt, emailConfirmed }: CreateChangeEmailRequestParams) {
    const changeRequest = await prisma.email_change_requests.create({
        data: {
            user_id: userId,
            old_email: oldEmail,
            new_email: newEmail,
            expires_at: expiresAt,
            updated_at: new Date()
        }
    });

    return {
        hasError: false,
        message: "Proceso de cambio iniciado. Confirma desde ambos emails.",
        payload: {
            id: changeRequest.id,
            currentEmail: changeRequest.old_email,
            newEmail: changeRequest.new_email,
            emailConfirmed: emailConfirmed,
            hasEmailChange: true,
            processCompleted: changeRequest?.completed,
        }
    }
}