"use server"

import { getCurrentUserWithIdAndEmailAction } from "@/features/auth/actions"
import { getChangeStatusData, getNewEmailStatusData, getOldEmailStatusData, getUserData, updateCompleteSupabaseProcessData, updateToCompleteChangeData } from "@/features/auth/data"
import { EmailChangeStatus } from "@/features/auth/types"
import { actionWrapper } from "@/features/global/utils"

export async function getEmailChangeStatusAction() {
    return actionWrapper<EmailChangeStatus>(async () => {

        const supabaseUser = await getUserData()
        const localUser = await getCurrentUserWithIdAndEmailAction()
        const normalizedLocalUser = {
            payload: localUser.payload
                ? {
                    id: localUser.payload.id,
                    email: localUser.payload.email,
                    email_confirmed_at: localUser.payload.email_confirmed_at
                        ? new Date(localUser.payload.email_confirmed_at)
                        : null,
                }
                : null,
        }
        //TODO: Revisar el tema de id por number o string

        const userId = localUser.payload?.id
        if (typeof userId !== 'number') {
            return {
                hasError: true,
                message: "El número de ID de usuario no es válido",
                payload: null
            }
        }

        const changeRequest = await getChangeStatusData({ userId })

        if (changeRequest.hasError) {
            throw new Error(changeRequest.message)
        }

        const change = changeRequest.payload ?? null
        const supabaseCompleted = !supabaseUser?.payload?.new_email
        const newEmailWasConfirmed = supabaseUser?.payload?.email === change?.new_email && change?.new_email_confirmed
        const oldEmailWasConfirmed = supabaseUser?.payload?.email === change?.old_email && change?.old_email_confirmed
        const changeWasCancelled = !supabaseUser?.payload?.new_email &&
            supabaseUser?.payload?.email === change?.old_email


        if (changeWasCancelled && change && !change.completed && typeof change.id === 'number' && change.old_email) {
            await updateToCompleteChangeData({ changeRequestId: change.id, cancelChangeEmail: change.old_email })
        }

        if (supabaseCompleted && !change?.completed) {
            await updateCompleteSupabaseProcessData({ localUser: normalizedLocalUser, changeRequest: change })

        }

        if (newEmailWasConfirmed && !change?.new_email_confirmed) {
            await getNewEmailStatusData({ userId: change?.id })
        }

        if (oldEmailWasConfirmed && !change?.old_email_confirmed) {
            await getOldEmailStatusData({ userId: change?.id })
        }

        if (localUser.hasError || !localUser.payload) {
            throw new Error(localUser.message)
        }

        return {
            hasError: false,
            message: "Estado de cambio de email obtenido",
            payload: {
                currentEmail: change?.old_email,
                newEmail: change?.new_email ?? null,
                emailConfirmed: localUser.payload?.email_confirmed_at !== null,
                hasEmailChange: true,
                processCompleted: Boolean(change?.completed),
                oldEmailConfirmed: Boolean(change?.old_email_confirmed),
                newEmailConfirmed: Boolean(change?.new_email_confirmed || newEmailWasConfirmed),
                changeWasCancelled: false,
                requestId: change?.id,
                expiresAt: change?.expires_at,
                oldEmailConfirmedAt: change?.old_email_confirmed_at,
                newEmailConfirmedAt: change?.new_email_confirmed_at,
                loading: false
            }
        }

    }
    )
}