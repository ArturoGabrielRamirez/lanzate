'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { getGoogleData } from "@/features/auth/data"
import { extractSubdomainFromHost, buildLoginErrorUrl } from '@/features/auth/utils'
import { actionWrapper } from '@/utils/lib'

export async function handleGoogleLogInAction() {
    const result = await actionWrapper(async () => {
        const headersList = await headers()
        const host = headersList.get('host') || ''
        const subdomain = extractSubdomainFromHost(host)
        const redirectUrl = `https://lanzate.app/auth/callback${subdomain ?
            `?subdomain=${subdomain}` : ''}`
        const { payload: googleData, hasError: googleError, message: googleMessage } = await getGoogleData({ redirectUrl, subdomain })

        if (googleError) {
            throw new Error(googleMessage)
        }

        if (!googleData?.url) {
            throw new Error('No se obtuvo la URL del proveedor de OAuth')
        }

        return {
            error: false,
            message: 'Se inició sesión con Google correctamente',
            payload: { url: googleData.url, subdomain: googleData.subdomain }
        }
    })

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

    const headersList = await headers()
    const host = headersList.get('host') || ''
    const subdomain = extractSubdomainFromHost(host)
    redirect(await buildLoginErrorUrl(subdomain, 'no_url'))
}