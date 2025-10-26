'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { getFacebookData } from "@/features/auth/data"
import { extractSubdomainFromHost, buildLoginErrorUrl } from '@/features/auth/utils'
import { actionWrapper } from '@/features/global/utils'

export async function handleFacebookLoginAction() {
    const result = await actionWrapper(async () => {
        const headersList = await headers()
        const host = headersList.get('host') || ''
        const subdomain = extractSubdomainFromHost(host)
        const redirectUrl = `https://lanzate.app/auth/callback${subdomain ?
            `?subdomain=${subdomain}` : ''}`
        const { payload: facebookData, hasError: facebookError, message: facebookMessage } = await getFacebookData({ redirectUrl })

        if (facebookError) {
            throw new Error(facebookMessage)
        }

        if (!facebookData?.url) {
            throw new Error('No se obtuvo la URL del proveedor de OAuth')
        }

        return {
            hasError: false,
            message: 'Facebook login initiated successfully',
            payload: { url: facebookData.url, subdomain }
        }
    })

    if (result.hasError) {
        const headersList = await headers()
        const host = headersList.get('host') || ''
        const subdomain = extractSubdomainFromHost(host)
        const errorUrl = await buildLoginErrorUrl(subdomain, 'oauth_failed', result.message)
        redirect(errorUrl)
    }

    if (result.payload?.url) {
        redirect(result.payload.url)
    }

    const headersList = await headers()
    const host = headersList.get('host') || ''
    const subdomain = extractSubdomainFromHost(host)
    redirect(await buildLoginErrorUrl(subdomain, 'no_url'))
}