"use server"

import { NewPassword } from "@/features/auth/types"
import { createServerSideClient } from "@/utils/supabase/server"

export async function createPasswordData({ newPassword }: NewPassword) {
    const supabase = createServerSideClient()
    const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
        data: {
            password_set: true
        }
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
        message: "Contraseña actualizada correctamente",
        payload: data
    }

}