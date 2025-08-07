"use server";

import { createServerSideClient } from "@/utils/supabase/server";
import { getCurrentUser } from "./get-user";
import { prisma } from "@/utils/prisma";
import { getLocalUser } from "./get-locale-user";
import { extractSubdomainFromHost } from "../utils";
import { headers } from "next/headers";

export async function handleEditEmail(email: string) {
    const { user, error: userError } = await getCurrentUser();
    const { localUser, error: localUserError } = await getLocalUser();
    
    if (userError || !user) {
        return { error: userError || "User not found" };
    }

    if (localUserError || !localUser) {
        return { error: localUserError || "Usuario no encontrado en la base de datos local" };
    }

    // Validaciones
    if (email === user.email) {
        return {
            error: "El nuevo email debe ser diferente al actual"
        };
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {
            error: "El formato del email no es válido"
        };
    }

    // Verificar que el nuevo email no esté en uso
    const emailInUse = await prisma.user.findFirst({
        where: {
            email: email,
            id: {
                not: localUser.id
            }
        }
    });

    if (emailInUse) {
        return {
            error: "Este email ya está en uso por otro usuario"
        };
    }

    try {
        const headersList = await headers();
        const host = headersList.get('host') || '';
        const subdomain = extractSubdomainFromHost(host);
        const supabase = await createServerSideClient();
        const baseUrl = `${subdomain ? `https://${subdomain}.lanzate.app` : `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}`;

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        // Cancelar cualquier solicitud anterior activa
        await prisma.email_change_requests.updateMany({
            where: {
                user_id: localUser.id,
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

        // Crear nueva solicitud
        const changeRequest = await prisma.email_change_requests.create({
            data: {
                user_id: localUser.id,
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
            // Limpiar la solicitud si falla
            await prisma.email_change_requests.delete({
                where: { id: changeRequest.id }
            });
            return { error: error.message };
        }

        // Crear log de acción
        try {
            await prisma.actionLog.create({
                data: {
                    action: 'EMAIL_CHANGE_REQUEST',
                    entity_type: 'EMAIL_CHANGE_REQUEST',
                    entity_id: changeRequest.id,
                    user_id: localUser.id,
                    action_initiator: 'USER',
                    details: `Email change requested from ${user.email} to ${email}`
                }
            });
        } catch (logError) {
            console.warn('⚠️ Failed to create action log:', logError);
        }

        return {
            success: true,
            data,
            message: "Proceso de cambio iniciado. Confirma desde ambos emails.",
            new_email: email,
            request_id: changeRequest.id
        };

    } catch (error) {
        console.error('Error in handleEditEmail:', error);
        return { error: "Error interno del servidor" };
    }
}

/* "use server";

import { createServerSideClient } from "@/utils/supabase/server";
import { getCurrentUser } from "./get-user";
import { prisma } from "@/utils/prisma";
import { getLocalUser } from "./get-locale-user";
import { extractSubdomainFromHost } from "../utils";
import { headers } from "next/headers";

export async function handleEditEmail(email: string) {
    const { user, error: userError } = await getCurrentUser();
    const { localUser, error: localUserError } = await getLocalUser();
    const headersList = await headers()
    const host = headersList.get('host') || ''
    const subdomain = extractSubdomainFromHost(host)
    const supabase = await createServerSideClient();
    const baseUrl = `${subdomain ? `https://${subdomain}.lanzate.app` : `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}`;

    if (userError || !user) {
        return { error: userError || "User not found" };
    }

    if (localUserError || !localUser) {
        return { error: localUserError || "Usuario no encontrado en la base de datos local" };
    }

    if (email === user.email) {
        return {
            error: "El nuevo email debe ser diferente al actual"
        };
    }

    try {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        const existingRequest = await prisma.email_change_requests.findFirst({
            where: {
                user_id: localUser.id,
                completed: false,
                expires_at: {
                    gt: new Date()
                }
            }
        });

        let changeRequest;

        if (existingRequest) {
            changeRequest = await prisma.email_change_requests.update({
                where: { id: existingRequest.id },
                data: {
                    new_email: email,
                    old_email_confirmed: false,
                    new_email_confirmed: false,
                    old_email_confirmed_at: null,
                    new_email_confirmed_at: null,
                    expires_at: expiresAt,
                    updated_at: new Date()
                }
            });
        } else {
            changeRequest = await prisma.email_change_requests.create({
                data: {
                    user_id: localUser.id,
                    old_email: user.email!,
                    new_email: email,
                    expires_at: expiresAt,
                    updated_at: new Date()
                }
            });
        }





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
            return { error: error.message };
        }

        return {
            success: true,
            data,
            message: "Proceso de cambio iniciado. Confirma desde ambos emails.",
            new_email: email,
            request_id: changeRequest.id
        };

    } catch (error) {
        console.error('Error in handleEditEmail:', error);
        return { error: "Error interno del servidor" };
    }
} */