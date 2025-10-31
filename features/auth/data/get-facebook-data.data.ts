"use server"
import { FacebookDataParams } from "@/features/auth/types"
import { createServerSideClient } from "@/utils/supabase/server"

export async function getFacebookData({ redirectUrl }: FacebookDataParams) {
    const supabase = createServerSideClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
            redirectTo: redirectUrl,
            scopes: 'email,public_profile',
            queryParams: {
                display: 'popup',
                auth_type: 'rerequest',
                response_type: 'code',
            },
        },
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
        message: "Se inició sesión con Facebook correctamente",
        payload: data
    }
}
