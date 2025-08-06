"use server";

import { createServerSideClient } from "@/utils/supabase/server";
import { getCurrentUser } from "./get-user";
import { prisma } from "@/utils/prisma";

export async function resendEmailConfirmation() {
    const { user, error: userError } = await getCurrentUser();

    if (userError || !user) {
        return { error: userError || "Usuario no encontrado" };
    }

    try {
        // Obtener el usuario local
        const localUser = await prisma.user.findFirst({
            where: { email: user.email }
        });

        if (!localUser) {
            return { error: "Usuario local no encontrado" };
        }

        // Buscar la solicitud de cambio activa
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

        if (!changeRequest) {
            return { error: "No hay solicitud de cambio activa" };
        }

        const supabase = await createServerSideClient();
        
        // Configurar la URL de redirección para el segundo email
        const baseUrl = process.env.NEXTAUTH_URL || `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
        const redirectTo = `${baseUrl}/account?emailCompleted=true`;

        // Reenviar la confirmación de cambio de email
        const { error } = await supabase.auth.updateUser(
            { email: changeRequest.new_email },
            {
                emailRedirectTo: redirectTo
            }
        );

        if (error) {
            console.error('Error resending email confirmation:', error);
            return { error: "Error al reenviar emails: " + error.message };
        }

        // Actualizar timestamp de la solicitud para extender tiempo
        await prisma.email_change_requests.update({
            where: { id: changeRequest.id },
            data: {
                updated_at: new Date(),
                // Opcional: extender el tiempo de expiración
                expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // +24 horas
            }
        });

        // Log del reenvío
        try {
            await prisma.actionLog.create({
                data: {
                    action: 'EMAIL_CONFIRMATION',
                    entity_type: 'EMAIL_CHANGE_REQUEST',
                    entity_id: changeRequest.id,
                    user_id: localUser.id,
                    action_initiator: 'USER',
                    details: `Email confirmations resent for change from ${changeRequest.old_email} to ${changeRequest.new_email}`
                }
            });
        } catch (logError) {
            console.warn('⚠️ Failed to create action log:', logError);
        }

        return {
            success: true,
            message: "Emails de confirmación reenviados exitosamente",
            data: {
                oldEmail: changeRequest.old_email,
                newEmail: changeRequest.new_email
            }
        };

    } catch (error) {
        console.error("Error resending email confirmation:", error);
        return { error: "Error interno del servidor" };
    }
}