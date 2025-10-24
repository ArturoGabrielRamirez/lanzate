"use server"

import { PasswordParams } from "@/features/auth/types"
import { createServerSideClient } from "@/utils/supabase/server"

export async function getPasswordData({ password }: PasswordParams) {
    const supabase = createServerSideClient()
    const { data, error } = await supabase.auth.getUser()

    if (error || !data.user) {
        return {
            hasError: true,
            message: "Usuario no autenticado",
            payload: null
        }
    }

    const { error: passwordError } = await supabase.auth.signInWithPassword({
        email: data.user.email!,
        password: password
    })

    if (passwordError) {
        return {
            hasError: true,
            message: "La contraseña es incorrecta",
            payload: null
        }
    }
}