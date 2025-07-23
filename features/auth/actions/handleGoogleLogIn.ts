'use server'

import { createServerSideClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
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
        const supabase = createServerSideClient()
        const redirectUrl = `${getURL()}auth/callback`;

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

        if (data?.url) {
            redirect(data.url);
        }

        if (data) {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { id, email, created_at } = user
                revalidatePath('/account', 'layout')
                redirect('/account')
            }
        }

        return {
            error: false,
            message: "Google OAuth initiated successfully",
            payload: data
        }
    })
}