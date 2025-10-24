"use server"

import { UpdateToCompleteChangeParams } from '@/features/auth/types'
import { prisma } from '@/utils/prisma'

export async function updateToCompleteChangeData({ changeRequestId, cancelChangeEmail }: UpdateToCompleteChangeParams) {
    await prisma.email_change_requests.update({
        where: { id: changeRequestId },
        data: {
            completed: true,
            completed_at: new Date(),
        }
    })

    return {
        hasError: false,
        message: "El cambio de email fue cancelado",
        payload: {
            currentEmail: cancelChangeEmail,
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