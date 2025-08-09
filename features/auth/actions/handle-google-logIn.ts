'use server'

import { createServerSideClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { extractSubdomainFromHost, buildLoginErrorUrl } from '@/features/auth/utils'

export async function handleGoogleLogIn() {

    const supabase = createServerSideClient()

    const headersList = await headers()
    const host = headersList.get('host') || ''
    const subdomain = extractSubdomainFromHost(host)

    const redirectUrl = `https://lanzate.app/auth/callback${subdomain ?
        `?subdomain=${subdomain}` : ''}`

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
        const errorUrl = await buildLoginErrorUrl(subdomain, 'oauth_failed', error.message)
        redirect(errorUrl)
    }

    if (data.url) {
        redirect(data.url)
    }

    redirect(await buildLoginErrorUrl(subdomain, 'no_url'))
}