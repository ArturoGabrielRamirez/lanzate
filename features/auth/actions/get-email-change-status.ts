"use server";

import { createServerSideClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prisma";
import { actionWrapper } from "@/utils/lib";

export async function getEmailChangeStatus() {
    return actionWrapper(async () => {
        // ✅ OBTENER DATOS DIRECTAMENTE, SIN DEPENDENCIAS CIRCULARES
        const supabase = await createServerSideClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return {
                error: true,
                message: "Usuario no autenticado",
                payload: null
            };
        }

        const localUser = await prisma.user.findFirst({
            where: { 
                OR: [
                    { supabase_user_id: user.id },
                    { email: user.email! }
                ]
            }
        });

        if (!localUser) {
            return {
                error: true,
                message: "Usuario no encontrado en la base de datos local",
                payload: null
            };
        }

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

        const {
            data: { user: freshUser },
            error: refreshError } = await supabase.auth.getUser();

        if (refreshError || !freshUser) {
            return {
                error: true,
                message: "Error al obtener estado del usuario",
                payload: null
            };
        }

        if (!changeRequest) {
            return {
                error: false,
                message: "Estado de cambio de email obtenido",
                payload: {
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
                error: false,
                message: "Estado de cambio de email obtenido",
                payload: {
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
            error: false,
            message: "Estado de cambio de email obtenido",
            payload: {
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
    });
}