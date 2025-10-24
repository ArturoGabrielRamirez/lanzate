"use server"

import { CancelChangeEmailRequestParams } from "@/features/auth/types"
import { prisma } from "@/utils/prisma"

export async function cancelChangeEmailRequestData({ userId, changeRequestId }: CancelChangeEmailRequestParams) {
    await prisma.email_change_requests.updateMany({
        where: {
            user_id: userId,
            completed: false,
            expires_at: {
                gt: new Date()
            }
        },
        data: {
            completed: true,
            completed_at: new Date()
        }
    });

    return {
        hasError: false,
        message: "El cambio de email fue cancelado",
        payload: {
            currentEmail: changeRequestId,
            newEmail: null,
            emailConfirmed: true,
            hasEmailChange: false,
            processCompleted: true,
            oldEmailConfirmed: true,
            newEmailConfirmed: false,
            changeWasCancelled: true
        }
    }
}