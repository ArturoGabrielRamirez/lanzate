'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { extractSubdomainFromHost, buildLoginErrorUrl } from '@/features/auth/utils'
import { actionWrapper } from '@/utils/lib'
import { createServerSideClient } from '@/utils/supabase/server'

export async function handleGoogleLogIn() {
    const result = await actionWrapper(async () => {
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
            throw new Error(error.message)
        }

        if (!data.url) {
            throw new Error('No URL returned from OAuth provider')
        }

        return {
            error: false,
            message: 'Google login initiated successfully',
            payload: { url: data.url, subdomain }
        }
    })

    // Manejo de redirects fuera del wrapper
    if (result.error) {
        const headersList = await headers()
        const host = headersList.get('host') || ''
        const subdomain = extractSubdomainFromHost(host)
        const errorUrl = await buildLoginErrorUrl(subdomain, 'oauth_failed', result.message)
        redirect(errorUrl)
    }

    if (result.payload?.url) {
        redirect(result.payload.url)
    }

    // Fallback redirect
    const headersList = await headers()
    const host = headersList.get('host') || ''
    const subdomain = extractSubdomainFromHost(host)
    redirect(await buildLoginErrorUrl(subdomain, 'no_url'))
}