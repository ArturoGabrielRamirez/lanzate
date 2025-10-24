"use server"

import { SignUpPermissionParams } from "@/features/auth/types"
import { createServerSideClient } from "@/utils/supabase/server"

export async function getSignUpPermissionData({ email, password }: SignUpPermissionParams) {
    const supabase = createServerSideClient()

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
    })

    if (signUpError) {
        return {
            hasError: true,
            message: signUpError.message,
            payload: null
        }
    }

    return {
        hasError: false,
        message: "Usuario registrado exitosamente",
        payload: signUpData.user
    }
}