import { NextRequest, NextResponse } from 'next/server'

import { getLocaleAndPathname } from '@/features/middleware/utils/get-locale-and-pathname'
import { isPublicProfileUrl } from '@/features/middleware/utils/is-public-profile-url'
import { validateSubdomainAction } from '@/features/subdomain/actions/validate-subdomain.action'
import { extractSubdomain } from '@/features/subdomain/middleware'
import { routing } from '@/i18n/routing'

export async function handleSubdomain(request: NextRequest, response: NextResponse): Promise<NextResponse> {

    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'lanzate.app'
    const subdomain = extractSubdomain(request)
    console.log("🚀 ~ handleSubdomain ~ subdomain:", subdomain)

    if (!subdomain) {
        return response
    }

    const { locale, pathWithoutLocale } = getLocaleAndPathname(request.nextUrl.pathname)
    const currentLocale = locale || routing.defaultLocale

    // If already on a /s/ route, don't rewrite
    if (pathWithoutLocale.startsWith('/s/')) {
        return response
    }

    // Validate subdomain exists
    try {
        const { payload: exists } = await validateSubdomainAction(subdomain)
        if (!exists) throw new Error("Subdomain not found")
    } catch (error) {
        return NextResponse.redirect(new URL('/not-found', `https://${rootDomain}`))
    }

    // Static route mappings
    const subdomainRoutes = {
        '/': `/${currentLocale}/s/${subdomain}`,
        '/cart': `/${currentLocale}/s/${subdomain}/cart`,
        '/checkout': `/${currentLocale}/s/${subdomain}/checkout`,
        '/my-orders': `/${currentLocale}/s/${subdomain}/my-orders`,
        '/account': `/${currentLocale}/s/${subdomain}/account`,
        '/products': `/${currentLocale}/s/${subdomain}/products`,
    }

    // Handle static routes
    if (subdomainRoutes[pathWithoutLocale as keyof typeof subdomainRoutes]) {
        const url = new URL(subdomainRoutes[pathWithoutLocale as keyof typeof subdomainRoutes], request.url)
        //console.log("🚀 ~ handleSubdomain ~ url:", url.href)
        //https://localhost:3000/en/s/lodemauri
        url.search = request.nextUrl.search
        return NextResponse.rewrite(url, response)
    }

    // Handle dynamic routes - my-orders with order ID
    if (pathWithoutLocale.startsWith('/my-orders/')) {
        const orderId = pathWithoutLocale.split('/my-orders/')[1]
        if (orderId && !isNaN(Number(orderId))) {
            const url = new URL(`/${currentLocale}/s/${subdomain}/my-orders/${orderId}`, request.url)
            url.search = request.nextUrl.search
            return NextResponse.rewrite(url, response)
        }
    }

    // Handle dynamic routes - item pages
    if (pathWithoutLocale.startsWith('/item/')) {
        const itemPath = pathWithoutLocale.split('/item/')[1]
        const url = new URL(`/${currentLocale}/s/${subdomain}/item/${itemPath}`, request.url)
        return NextResponse.rewrite(url, response)
    }

    // Allow public profile routes
    if (isPublicProfileUrl(pathWithoutLocale)) {
        return response
    }

    return response
}
