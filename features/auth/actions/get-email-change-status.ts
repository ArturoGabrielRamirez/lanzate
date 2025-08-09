"use server";

import { createServerSideClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prisma";
import { getLocalUser } from "./index";

export async function getEmailChangeStatus() {
    const { localUser, error: localUserError } = await getLocalUser();

    if (localUserError || !localUser) {
        return { error: localUserError || "Usuario no encontrado" };
    }

    try {
        const changeRequest = await prisma.email_change_requests.findFirst({
            where: {
                user_id: localUser.id,
                completed: false,
                expires_at: {
                    gt: new Date()
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        const supabase = await createServerSideClient();

        const {
            data: { user: freshUser },
            error: refreshError } = await supabase.auth.getUser();

        if (refreshError || !freshUser) {
            return { error: "Error al obtener estado del usuario" };
        }

        if (!changeRequest) {
            return {
                success: true,
                data: {
                    currentEmail: freshUser.email,
                    newEmail: null,
                    emailConfirmed: freshUser.email_confirmed_at !== null,
                    hasEmailChange: false,
                    processCompleted: true,
                    oldEmailConfirmed: true,
                    newEmailConfirmed: true,
                }
            };
        }
        const supabaseCompleted = !freshUser.new_email;

        if (supabaseCompleted && !changeRequest.completed) {
            await prisma.email_change_requests.update({
                where: { id: changeRequest.id },
                data: {
                    completed: true,
                    completed_at: new Date(),
                    new_email_confirmed: true,
                    new_email_confirmed_at: new Date()
                }
            });

            await prisma.user.update({
                where: { id: localUser.id },
                data: {
                    email: changeRequest.new_email,
                    updated_at: new Date()
                }
            });

            return {
                success: true,
                data: {
                    currentEmail: freshUser.email,
                    newEmail: null,
                    emailConfirmed: true,
                    hasEmailChange: false,
                    processCompleted: true,
                    oldEmailConfirmed: true,
                    newEmailConfirmed: true,
                }
            };
        }

        return {
            success: true,
            data: {
                currentEmail: changeRequest.old_email,
                newEmail: changeRequest.new_email,
                emailConfirmed: freshUser.email_confirmed_at !== null,
                hasEmailChange: true,
                processCompleted: changeRequest.completed,
                oldEmailConfirmed: changeRequest.old_email_confirmed,
                newEmailConfirmed: changeRequest.new_email_confirmed,
                requestId: changeRequest.id,
                expiresAt: changeRequest.expires_at,
                oldEmailConfirmedAt: changeRequest.old_email_confirmed_at,
                newEmailConfirmedAt: changeRequest.new_email_confirmed_at
            }
        };
    } catch (error) {
        console.error('Error getting email change status:', error);
        return { error: "Error interno del servidor" };
    }
}