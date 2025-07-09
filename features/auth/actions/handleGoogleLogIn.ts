'use server'

import { createServerSideClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const getURL = () => {
    let url =
        process?.env?.NEXTAUTH_URL ??
        process?.env?.NEXT_PUBLIC_VERCEL_URL ??
        'http://localhost:3000/'

    url = url.startsWith('http') ? url : `https://${url}`

    url = url.endsWith('/') ? url : `${url}/`
    return url
}

export async function handleGoogleLogIn() {
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
        console.log(error)
        return;
    }

    if (data?.url) {
        redirect(data.url);
    }

    if (data) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { id, email, created_at } = user
            console.log(id, email, created_at)
            revalidatePath('/account', 'layout')
            redirect('/account')
        }
    }
}