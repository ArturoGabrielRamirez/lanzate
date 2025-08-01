'use server'
import { createServerSideClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function handleGoogleLogIn() {
    const supabase = await createServerSideClient()
    const headersList = await headers()
    const host = headersList.get('host') || ''
    const subdomain = extractSubdomainFromHost(host)
    
    const redirectUrl = `https://lanzate.app/auth/callback${subdomain ? `?subdomain=${subdomain}` : ''}`

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

function extractSubdomainFromHost(host: string): string | null {
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'lanzate.app'
    
    if (host === rootDomain || host === `www.${rootDomain}`) {
        return null
    }
    
    const subdomain = host.replace(`.${rootDomain}`, '')
    return subdomain !== host ? subdomain : null
}