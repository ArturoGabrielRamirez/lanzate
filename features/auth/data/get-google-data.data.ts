"use server"

import { GoogleDataParams } from "@/features/auth/types"
import { createServerSideClient } from "@/utils/supabase/server"

export async function getGoogleData({ redirectUrl, subdomain }: GoogleDataParams) {
    const supabase = createServerSideClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectUrl,
            scopes: 'email profile',
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
                include_granted_scopes: 'true',
            },
        },
    })
    if (error) {
        throw new Error(error.message)
    }
    if (!data.url) {
        throw new Error('No se obtuvo la URL del proveedor de OAuth')
    }
    return {
        hasError: false,
        message: 'Se inició sesión con Google correctamente',
        payload: { url: data.url, subdomain }
    }
}