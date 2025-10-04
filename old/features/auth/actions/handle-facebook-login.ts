'use server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { extractSubdomainFromHost, buildLoginErrorUrl } from '@/features/auth/utils'
import { createServerSideClient } from '@/utils/supabase/server'
import { actionWrapper } from '@/utils/lib'

export async function handleFacebookLogin() {
    const result = await actionWrapper(async () => {
        const supabase = createServerSideClient()
        const headersList = await headers()
        const host = headersList.get('host') || ''
        const subdomain = extractSubdomainFromHost(host)
        const redirectUrl = `https://lanzate.app/auth/callback${subdomain ?
            `?subdomain=${subdomain}` : ''}`
        
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
            throw new Error(error.message)
        }

        if (!data.url) {
            throw new Error('No URL returned from OAuth provider')
        }

        return {
            error: false,
            message: 'Facebook login initiated successfully',
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