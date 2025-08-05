import { createServerClient } from '@supabase/ssr'
import createIntlMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { extractSubdomain } from '@/features/subdomain/middleware/middleware'
import { validateSubdomain } from '@/features/subdomain/actions/validateSubdomain'
import { routing } from '@/i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

function shouldApplyI18n(pathname: string): boolean {
  return !(
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/auth/') ||
    pathname.includes('.')
  )
}

function extractLocaleFromPath(pathname: string): { locale: string | null; pathWithoutLocale: string } {
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]

  if (routing.locales.includes(firstSegment as any)) {
    return {
      locale: firstSegment,
      pathWithoutLocale: '/' + segments.slice(1).join('/')
    }
  }

  return {
    locale: null,
    pathWithoutLocale: pathname
  }
}

function createCookieConfig() {
  return {
    domain: '.lanzate.app',
    secure: true,
    sameSite: 'none' as const
  }
}

export async function updateSession(request: NextRequest) {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'lanzate.app'
  const subdomain = extractSubdomain(request)

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

          response = NextResponse.next({ request })

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, { ...options, ...cookieConfig })
          })
        },
      },
    }
  )

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (error) {
    console.error('Error getting user:', error)
  }

  if (subdomain) {
    const { locale, pathWithoutLocale } = extractLocaleFromPath(pathname)

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

    const currentLocale = locale || routing.defaultLocale

    const subdomainRoutes = {
      '/': `/${currentLocale}/s/${subdomain}`,
      '/cart': `/${currentLocale}/s/${subdomain}/cart`,
      '/checkout': `/${currentLocale}/s/${subdomain}/checkout`,
      '/my-orders': `/${currentLocale}/s/${subdomain}/my-orders`,
      '/account': `/${currentLocale}/s/${subdomain}/account`,
    }
    
    if (subdomainRoutes[pathWithoutLocale as keyof typeof subdomainRoutes]) {
      const url = new URL(subdomainRoutes[pathWithoutLocale as keyof typeof subdomainRoutes], request.url)
      url.search = request.nextUrl.search
      return NextResponse.rewrite(url)
    }

    // Handle dynamic routes
    if (pathWithoutLocale.startsWith('/my-orders/')) {
      const orderId = pathWithoutLocale.split('/my-orders/')[1]
      if (orderId && !isNaN(Number(orderId))) {
        const url = new URL(`/${currentLocale}/s/${subdomain}/my-orders/${orderId}`, request.url)
        url.search = request.nextUrl.search
        return NextResponse.rewrite(url)
      }
    }

    if (pathWithoutLocale.startsWith('/item/')) {
      const itemPath = pathWithoutLocale.split('/item/')[1]
      const url = new URL(`/${currentLocale}/s/${subdomain}/item/${itemPath}`, request.url)
      return NextResponse.rewrite(url)
    }

    return response
  }

  const { locale, pathWithoutLocale } = extractLocaleFromPath(pathname)
  const currentLocale = locale || routing.defaultLocale

  if (!user && (pathWithoutLocale === '/account' || pathWithoutLocale.includes('/dashboard'))) {
    const url = new URL(`/${currentLocale}/login`, `https://${rootDomain}`)
    return NextResponse.redirect(url)
  }

  if (user && (pathWithoutLocale.includes('/login') || pathWithoutLocale.includes('/signup'))) {
    const url = new URL(`/${currentLocale}/account`, `https://${rootDomain}`)
    return NextResponse.redirect(url)
  }

  return response
}