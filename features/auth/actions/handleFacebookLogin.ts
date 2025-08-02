'use server'

import { createServerSideClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { extractSubdomainFromHost } from '../utils/extract-subdomain-from-host'
import { buildLoginErrorUrl } from '../utils/build-login-error-url'

export async function handleFacebookLogin() {
    const supabase = await createServerSideClient()
    const headersList = await headers()
    const host = headersList.get('host') || ''
    const subdomain = extractSubdomainFromHost(host)

    const redirectUrl = `https://lanzate.app/auth/callback${subdomain ? `?subdomain=${subdomain}` : ''}`

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
        console.error('Facebook OAuth error:', error)
        const errorUrl = await buildLoginErrorUrl(subdomain, 'oauth_failed', error.message)
        redirect(errorUrl)
    }

    if (data.url) {
        redirect(data.url)
    }
    redirect(await buildLoginErrorUrl(subdomain, 'no_url'))
}