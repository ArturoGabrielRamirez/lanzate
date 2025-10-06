import { NextRequest, NextResponse } from "next/server";
import { extractSubdomain, shouldApplyI18n, extractLocaleFromPath, createCookieConfig } from "@/features/middleware/utils";
import { createServerClient } from "@supabase/ssr";
import { User } from "@supabase/supabase-js";
import { routing } from "@/i18n/routing";
import { validateSubdomain } from "@/features/middleware/actions";
import createIntlMiddleware from 'next-intl/middleware'

const intlMiddleware = createIntlMiddleware(routing)

import { APP_CONFIG } from "@/features/global/constants";

export async function updateSession(request: NextRequest) {
    const rootDomain = APP_CONFIG.ROOT_DOMAIN;
    const subdomain = extractSubdomain(request);

    const { pathname } = request.nextUrl

    let response: NextResponse

    if (shouldApplyI18n(pathname)) {
        const intlResponse = intlMiddleware(request)

        if (intlResponse?.status >= 300 && intlResponse?.status < 400) {
            if (subdomain) {
                const location = intlResponse.headers.get('location')
                if (location) {
                    const locationUrl = new URL(location)
                    locationUrl.hostname = request.nextUrl.hostname
                    intlResponse.headers.set('location', locationUrl.toString())
                }
            }
            return intlResponse
        }
        response = intlResponse || NextResponse.next()
    } else {
        response = NextResponse.next()
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => request.cookies.getAll(),
                setAll: (cookiesToSet) => {
                    const cookieConfig = createCookieConfig()

                    cookiesToSet.forEach(({ name, value }) => {
                        request.cookies.set(name, value)
                    })

                    //response = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, { ...options, ...cookieConfig })
                    })
                },
            },
        }
    )

    let user: User | null = null
    try {
        const { data } = await supabase.auth.getUser()
        user = data.user
    } catch (error) {
        console.error('Error getting user:', error)
    }

    const { locale, pathWithoutLocale } = extractLocaleFromPath(pathname)
    const currentLocale = locale || routing.defaultLocale

    // Manejar subdominios
    if (subdomain) {
        if (pathWithoutLocale.startsWith('/s/')) {
            return response
        }

        try {
            const { payload: exists } = await validateSubdomain(subdomain)
            if (!exists) {
                const url = new URL('/not-found', `https://${rootDomain}`)
                return NextResponse.redirect(url)
            }
        } catch (error) {
            console.error('Error validating subdomain:', error)
        }

        const subdomainRoutes = {
            '/': `/${currentLocale}/s/${subdomain}`,
            '/cart': `/${currentLocale}/s/${subdomain}/cart`,
            '/checkout': `/${currentLocale}/s/${subdomain}/checkout`,
            '/my-orders': `/${currentLocale}/s/${subdomain}/my-orders`,
            '/account': `/${currentLocale}/s/${subdomain}/account`,
            '/products': `/${currentLocale}/s/${subdomain}/products`,
        }

        if (subdomainRoutes[pathWithoutLocale as keyof typeof subdomainRoutes]) {
            const url = new URL(subdomainRoutes[pathWithoutLocale as keyof typeof subdomainRoutes], request.url)
            url.search = request.nextUrl.search
            //return NextResponse.rewrite(url)
            return NextResponse.rewrite(url, response)
        }

        // Handle dynamic routes
        if (pathWithoutLocale.startsWith('/my-orders/')) {
            const orderId = pathWithoutLocale.split('/my-orders/')[1]
            if (orderId && !isNaN(Number(orderId))) {
                const url = new URL(`/${currentLocale}/s/${subdomain}/my-orders/${orderId}`, request.url)
                url.search = request.nextUrl.search
                return NextResponse.rewrite(url, response)
            }
        }

        if (pathWithoutLocale.startsWith('/item/')) {
            const itemPath = pathWithoutLocale.split('/item/')[1]
            const url = new URL(`/${currentLocale}/s/${subdomain}/item/${itemPath}`, request.url)
            return NextResponse.rewrite(url, response)
        }

        return response
    }

    const publicRoutes = [
        '/',
        '/login',
        '/signup',
        '/forgot-password',
        '/privacy-policy',
        '/terms-and-conditions',
        '/cookies',
    ]
    // Redirecciones de autenticación simples
    if (!user && !publicRoutes.includes(pathWithoutLocale)) {
        const url = new URL(`/${currentLocale}/login`, `https://${rootDomain}`)
        return NextResponse.redirect(url)
    }

    if (user && publicRoutes.includes(pathWithoutLocale)) {
        const url = new URL(`/${currentLocale}/dashboard`, `https://${rootDomain}`)
        return NextResponse.redirect(url)
    }

    return response
}