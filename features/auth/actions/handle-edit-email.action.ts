"use server"

import { headers } from "next/headers"

import { getCurrentUserWithIdAndEmailAction } from "@/features/auth/actions"
import { cancelChangeEmailRequestData, createChangeEmailRequestData, getEmailUsedData, getPasswordData, updateUserEmailConfirmedData, } from "@/features/auth/data"
import { EditEmailParams } from "@/features/auth/types"
import { extractSubdomainFromHost } from "@/features/auth/utils"
import { actionWrapper } from "@/features/global/utils"

export async function handleEditEmailAction({email, password}: EditEmailParams) {

    return actionWrapper(async () => {

        const { payload: user, hasError: userError, message: userMessage } = await getCurrentUserWithIdAndEmailAction()

        if (userError || !user) {
            return {
                hasError: true,
                message: userMessage || "Usuario no encontrado",
                payload: null
            };
        }

        if (email === user.email) {
            return {
                hasError: true,
                message: "El nuevo email debe ser diferente al actual",
                payload: null
            };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return {
                hasError: true,
                message: "El formato del email no es válido",
                payload: null
            };
        }

        const passwordError = await getPasswordData({ password })
        if (passwordError?.hasError) {
            throw new Error(passwordError.message)
        }

        const emailError = await getEmailUsedData({ email, userId: user.id! })
        if (emailError?.hasError) {
            throw new Error(emailError.message)
        }

        const headersList = await headers()
        const host = headersList.get('host') || ''
        const subdomain = extractSubdomainFromHost(host);
        const baseUrl = `${subdomain ? `https://${subdomain}.lanzate.app` : `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}`
        const expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + 1)
        const changeRequest = await createChangeEmailRequestData(
            { userId: user.id!, oldEmail: user.email!, newEmail: email, expiresAt, emailConfirmed: true }
        )

        const { hasError: cancelError, message: cancelMessage, payload: cancelPayload } = await cancelChangeEmailRequestData({ userId: user.id, changeRequestId: changeRequest.payload?.currentEmail })

        if (cancelError) {
            throw new Error(cancelMessage)
        }

        const redirectTo = `${baseUrl}/account?emailCompleted=true`;
        const data = await updateUserEmailConfirmedData({ newEmail: email, email, redirectTo, changeRequestId: changeRequest.payload.id, userId: user.id! });


        return {
            hasError: false,
            message: "Proceso de cambio iniciado. Confirma desde ambos emails.",
            payload: {
                data,
                new_email: email,
                request_id: changeRequest.payload.id,
                ...(cancelPayload ? { cancelPayload } : null)
            }
        }
    })
}