"use server"

import { getCurrentUser } from "@/features/auth/actions"
import { actionWrapper } from "@/features/global/utils"
import { prisma } from "@/utils/prisma"
import { createServerSideClient } from "@/utils/supabase/server"

// Define el tipo de retorno explícitamente
type EmailChangeStatus = {
    currentEmail: string | undefined
    newEmail: string | null
    emailConfirmed: boolean
    hasEmailChange: boolean
    processCompleted: boolean
    oldEmailConfirmed: boolean
    newEmailConfirmed: boolean
    changeWasCancelled: boolean
    requestId?: string | number
    expiresAt?: Date
    oldEmailConfirmedAt?: Date | null
    newEmailConfirmedAt?: Date | null
}

export async function getEmailChangeStatus() {
    return actionWrapper<EmailChangeStatus>(async () => {
        const supabase = createServerSideClient()
        const { data: { user: supabaseUser } } = await supabase.auth.getUser()
        
        const localUser = await getCurrentUser()

        if (!localUser.payload?.id) {
            return {
                hasError: true,
                message: "Usuario no encontrado",
                payload: null
            }
        }

        const changeRequest = await prisma.email_change_requests.findFirst({
            where: {
                user_id: localUser.payload.id,
                completed: false,
                expires_at: {
                    gt: new Date()
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        // ✅ VERIFICACIÓN: Si Supabase ya no tiene new_email, el proceso se completó
        const supabaseCompleted = !supabaseUser?.new_email

        if (!changeRequest) {
            return {
                hasError: false,
                message: "Estado de cambio de email obtenido",
                payload: {
                    currentEmail: localUser.payload?.email,
                    newEmail: null,
                    emailConfirmed: localUser.payload?.email_confirmed_at !== null,
                    hasEmailChange: false,
                    processCompleted: true,
                    oldEmailConfirmed: true,
                    newEmailConfirmed: true,
                    changeWasCancelled: false
                }
            }
        }

        // ✅ DETECTAR QUÉ EMAIL SE CONFIRMÓ
        // Si el email actual de Supabase coincide con el nuevo email, se confirmó el nuevo
        const newEmailWasConfirmed = supabaseUser?.email === changeRequest.new_email
        
        // Si ya no hay new_email pendiente y el email actual es el viejo, se canceló
        const changeWasCancelled = !supabaseUser?.new_email && 
                                    supabaseUser?.email === changeRequest.old_email

        // Si se canceló el cambio, marcar la solicitud como completada/cancelada
        if (changeWasCancelled && !changeRequest.completed) {
            await prisma.email_change_requests.update({
                where: { id: changeRequest.id },
                data: {
                    completed: true,
                    completed_at: new Date(),
                }
            })

            return {
                hasError: false,
                message: "El cambio de email fue cancelado",
                payload: {
                    currentEmail: changeRequest.old_email,
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

        // Si Supabase completó el proceso pero la BD local no
        if (supabaseCompleted && !changeRequest.completed) {
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
                where: { id: localUser.payload.id },
                data: {
                    email: changeRequest.new_email,
                    updated_at: new Date()
                }
            })

            return {
                hasError: false,
                message: "Estado de cambio de email obtenido",
                payload: {
                    currentEmail: changeRequest.new_email,
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

        // Actualizar el estado según lo detectado
        if (newEmailWasConfirmed && !changeRequest.new_email_confirmed) {
            await prisma.email_change_requests.update({
                where: { id: changeRequest.id },
                data: {
                    new_email_confirmed: true,
                    new_email_confirmed_at: new Date()
                }
            })
        }

        return {
            hasError: false,
            message: "Estado de cambio de email obtenido",
            payload: {
                currentEmail: changeRequest.old_email,
                newEmail: changeRequest.new_email,
                emailConfirmed: localUser.payload?.email_confirmed_at !== null,
                hasEmailChange: true,
                processCompleted: changeRequest.completed,
                oldEmailConfirmed: changeRequest.old_email_confirmed,
                newEmailConfirmed: changeRequest.new_email_confirmed || newEmailWasConfirmed,
                changeWasCancelled: false,
                requestId: changeRequest.id,
                expiresAt: changeRequest.expires_at,
                oldEmailConfirmedAt: changeRequest.old_email_confirmed_at,
                newEmailConfirmedAt: changeRequest.new_email_confirmed_at
            }
        }
    })
}