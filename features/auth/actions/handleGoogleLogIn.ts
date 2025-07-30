'use server'
import { createServerSideClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function handleGoogleLogIn() {
    const supabase = await createServerSideClient()
    const redirectUrl = `https://lanzate.app/auth/callback`

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectUrl,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    })

    if (error) {
        throw new Error(error.message)
    }

    if (data.url) {
        redirect(data.url)
    }
}