"use server"

import { CreateResetPasswordDataParams } from "@/features/auth/types"
import { createServerSideClient } from "@/utils/supabase/server"

export async function createResetPasswordData({ baseUrl, email }: CreateResetPasswordDataParams) {
    const supabase = createServerSideClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/update-password`,
    })
    if (error) {
        return {
            hasError: true,
            message: error.message,
            payload: null
        }
    }

    return {
        hasError: false,
        message: "Se envió el correo para restablecer la contraseña",
        payload: null
    }

}
