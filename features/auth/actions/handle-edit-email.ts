"use server";
import { createServerSideClient } from "@/utils/supabase/server";
import { getCurrentUser } from "./index";
import { prisma } from "@/utils/prisma";
import { extractSubdomainFromHost } from "../utils";
import { headers } from "next/headers";
import { actionWrapper } from "@/utils/lib";

export async function handleEditEmail(email: string, password: string) {
    return actionWrapper(async () => {
        const { payload: user, error: userError, message: userMessage } = await getCurrentUser();
        /*       const { payload: localUser, error: localUserError, message: localUserMessage } = await getLocalUser(); */

        if (userError || !user) {
            return {
                error: true,
                message: userMessage || "Usuario no encontrado",
                payload: null
            };
        }

        /*     if (localUserError || !localUser) {
                return { 
                    error: true, 
                    message: localUserMessage || "Usuario no encontrado en la base de datos local", 
                    payload: null 
                };
            } */

        if (email === user.email) {
            return {
                error: true,
                message: "El nuevo email debe ser diferente al actual",
                payload: null
            };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                error: true,
                message: "El formato del email no es válido",
                payload: null
            };
        }

        // Verificar la contraseña usando Supabase
        const supabase = createServerSideClient();
        const { error: passwordError } = await supabase.auth.signInWithPassword({
            email: user.email!,
            password: password
        });

        if (passwordError) {
            return {
                error: true,
                message: "La contraseña es incorrecta",
                payload: null
            };
        }

        // Verificar si el email ya está en uso
        const emailInUse = await prisma.user.findFirst({
            where: {
                email: email,
                id: {
                    not: user.id
                }
            }
        });

        if (emailInUse) {
            return {
                error: true,
                message: "Este email ya está en uso por otro usuario",
                payload: null
            };
        }

        const headersList = await headers();
        const host = headersList.get('host') || '';
        const subdomain = extractSubdomainFromHost(host);
        const baseUrl = `${subdomain ? `https://${subdomain}.lanzate.app` : `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}`;

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        // Cancelar requests anteriores
        await prisma.email_change_requests.updateMany({
            where: {
                user_id: user.id,
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

        const changeRequest = await prisma.email_change_requests.create({
            data: {
                user_id: user.id,
                old_email: user.email!,
                new_email: email,
                expires_at: expiresAt,
                updated_at: new Date()
            }
        });

        const redirectTo = `${baseUrl}/account?emailCompleted=true`;
        const { data, error } = await supabase.auth.updateUser(
            { email: email },
            {
                emailRedirectTo: redirectTo
            }
        );

        if (error) {
            await prisma.email_change_requests.delete({
                where: { id: changeRequest.id }
            });
            return {
                error: true,
                message: error.message,
                payload: null
            };
        }

        // Log de la acción (opcional, no bloquea en caso de error)
        try {
            await prisma.actionLog.create({
                data: {
                    action: 'EMAIL_CHANGE_REQUEST',
                    entity_type: 'EMAIL_CHANGE_REQUEST',
                    entity_id: changeRequest.id,
                    user_id: user.id,
                    action_initiator: 'USER',
                    details: `Email change requested from ${user.email} to ${email}`
                }
            });
        } catch (logError) {
            console.warn('⚠️ Failed to create action log:', logError);
            // No retornamos error aquí porque el log no es crítico
        }

        return {
            error: false,
            message: "Proceso de cambio iniciado. Confirma desde ambos emails.",
            payload: {
                data,
                new_email: email,
                request_id: changeRequest.id
            }
        };
    });
}