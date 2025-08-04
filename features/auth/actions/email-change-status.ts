"use server";

import { createServerSideClient } from "@/utils/supabase/server";
import { getCurrentUser } from "./get-user";

export async function getEmailChangeStatus() {
    const { user, error } = await getCurrentUser();
    
    if (error || !user) {
        return { error: "Usuario no encontrado" };
    }

    const supabase = await createServerSideClient();
    
    // Obtener información actualizada del usuario
    const { data: { user: freshUser }, error: refreshError } = await supabase.auth.getUser();
    
    if (refreshError || !freshUser) {
        return { error: "Error al obtener estado del usuario" };
    }

    return {
        success: true,
        data: {
            currentEmail: freshUser.email,
            newEmail: freshUser.new_email || null,
            emailConfirmed: freshUser.email_confirmed_at !== null,
            hasEmailChange: freshUser.new_email !== null,
            processCompleted: freshUser.new_email === null,
            // Estados del proceso
            oldEmailConfirmed: !freshUser.new_email ? true : false, // Si no hay new_email, el actual ya fue confirmado
            newEmailConfirmed: freshUser.new_email === null, // Si new_email es null, ya se completó el cambio
        }
    };
}
