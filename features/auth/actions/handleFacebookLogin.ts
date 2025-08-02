'use server'

import { createServerSideClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { headers } from 'next/headers'

export async function handleFacebookLogin() {
    const supabase = await createServerSideClient()
    
    // URL absoluta sin variables por ahora
    const redirectUrl = 'https://lanzate.app/auth/callback'

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
            redirectTo: redirectUrl,
            // NO agregues scopes - deja que Facebook use los defaults
        },
    })

    if (error) {
        console.error('Facebook OAuth error:', error)
        throw new Error(error.message)
    }

    if (data.url) {
        console.log('Redirecting to:', data.url)
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