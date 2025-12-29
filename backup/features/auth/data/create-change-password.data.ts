"use server"

import { CreateChangePasswordParams } from "@/features/auth/types"
import { createServerSideClient } from "@/utils/supabase/server"

export async function createChangePasswordData({ email, currentPassword }: CreateChangePasswordParams) {
    const supabase = createServerSideClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: currentPassword
    })

    if (signInError) {
        return {
            hasError: true,
            message: "La contraseña actual es incorrecta",
            payload: null
        };
    }

    return {
        hasError: false,
        message: "Usuario autenticado correctamente",
        payload: null
    };

}