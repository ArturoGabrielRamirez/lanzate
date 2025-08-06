"use server";

import { createServerSideClient } from "@/utils/supabase/server";
import { getCurrentUser } from "./get-user";
import { prisma } from "@/utils/prisma";

export async function handleEditEmail(email: string) {
    const { user, error: userError } = await getCurrentUser();

    if (userError || !user) {
        return { error: userError || "User not found" };
    }

    const localUser = await prisma.user.findFirst({
        where: {
            email: user.email
        }
    });

    if (!localUser) {
        return { error: "Usuario no encontrado en la base de datos local" };
    }

    try {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // Expira en 24 horas

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

        const supabase = await createServerSideClient();

        const baseUrl = process.env.NEXTAUTH_URL || `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
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
        return { error: "Error interno del servidor" };
    }
}