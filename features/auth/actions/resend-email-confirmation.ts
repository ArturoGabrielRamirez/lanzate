"use server";

import { getCurrentUser } from "./get-user";
import { getLocalUser } from "./get-locale-user";
import { createServerSideClient } from "@/utils/supabase/server";
import { extractSubdomainFromHost } from "../utils";
import { headers } from "next/headers";

export async function resendEmailConfirmation() {
    const { user, error: userError } = await getCurrentUser();
    const { localUser, error: localUserError } = await getLocalUser();

    if (userError || !user) {
        return { 
            success: false, 
            error: userError || "Usuario no autenticado" 
        };
    }

    if (localUserError || !localUser) {
        return { 
            success: false, 
            error: localUserError || "Usuario no encontrado en la base de datos local" 
        };
    }

    try {
        const headersList = await headers();
        const host = headersList.get('host') || '';
        const subdomain = extractSubdomainFromHost(host);
        const supabase = await createServerSideClient();
        
        const baseUrl = `${subdomain ? `https://${subdomain}.lanzate.app` : `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}`;
        const redirectTo = `${baseUrl}/account?emailCompleted=true`;

        if (user.new_email) {
            const { error } = await supabase.auth.resend({
                type: 'email_change',
                email: user.new_email,
                options: {
                    emailRedirectTo: redirectTo
                }
            });

            if (error) {
                return {
                    success: false,
                    error: `Error al reenviar email de cambio: ${error.message}`
                };
            }

            return {
                success: true,
                message: "Email de confirmación de cambio reenviado"
            };
        }

        if (!user.email_confirmed_at) {  
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: user.email!,
                options: {
                    emailRedirectTo: redirectTo
                }
            });

            if (error) {
                return {
                    success: false,
                    error: error.message
                };
            }

            return {
                success: true,
                message: "Email de confirmación reenviado"
            };
        }

        return {
            success: false,
            error: "No hay confirmaciones pendientes"
        };

    } catch (error) {
        console.error('❌ Error in resendEmailConfirmation:', error);
        return {
            success: false,
            error: "Error interno del servidor"
        };
    }
}