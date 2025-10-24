"use server"

import { headers } from 'next/headers'

import { routing } from '@/i18n/routing'

export async function buildLoginErrorUrl(
    subdomain: string | null,
    error: string,
    message?: string
): Promise<string> {
    const headersList = await headers()
    const acceptLanguage = headersList.get('accept-language')
    const preferredLocale = acceptLanguage?.split(',')[0]?.split('-')[0]
    const locale = routing.locales.includes(preferredLocale as typeof routing.locales[number])
        ? preferredLocale
        : routing.defaultLocale

    const baseUrl = subdomain ? `https://${subdomain}.lanzate.app` : 'https://lanzate.app'
    const params = new URLSearchParams({
        error,
        ...(message && { message }),
        ...(subdomain && { subdomain }),
    })

    return `${baseUrl}/${locale}/login?${params.toString()}`
}