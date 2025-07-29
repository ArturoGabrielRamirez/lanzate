'use server'
import { createServerSideClient } from '@/utils/supabase/server'
import { actionWrapper } from '@/utils/lib'

const getURL = () => {
    let url =
        process?.env?.NEXTAUTH_URL ??
        process?.env?.NEXT_PUBLIC_VERCEL_URL ??
        'http://localhost.com:3000/'
    url = url.startsWith('http') ? url : `https://${url}`
    url = url.endsWith('/') ? url : `${url}/`
    return url
}

export async function handleGoogleLogIn() {
    return actionWrapper(async () => {
        const supabase = await createServerSideClient()
        const redirectUrl = `${getURL()}auth/callback`

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                //redirectTo: redirectUrl,
                redirectTo : "https://lanzate.app/auth/callback",
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        })

        if (error) {
            throw new Error(error.message)
        }

        return {
            error: false,
            message: "Google OAuth initiated successfully",
            payload: {
                url: data.url,
                provider: data.provider
            }
        }
    })
}