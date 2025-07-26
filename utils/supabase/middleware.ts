import { createServerClient } from '@supabase/ssr'
import createIntlMiddleware from 'next-intl/middleware'

import { NextResponse, type NextRequest } from 'next/server'
import { extractSubdomain } from '@/features/subdomain/middleware/middleware'
import { validateSubdomain } from '@/features/subdomain/actions/validateSubdomain'
import { routing } from '@/i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

function shouldApplyI18n(pathname: string): boolean {

  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/auth/') ||
    pathname.includes('.')
  ) {
    return false
  }
  return true
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

export async function updateSession(request: NextRequest) {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost.com'
  const subdomain = extractSubdomain(request)
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/auth/')) {
    let response = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value)
            })
            response = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    await supabase.auth.getUser()

    return response
  }

  let response: NextResponse

  if (shouldApplyI18n(pathname)) {
    try {
      const intlResponse = intlMiddleware(request)
      if (intlResponse) {
        response = intlResponse
        if (response.status === 307 || response.status === 308 || response.headers.get('location')) {
          if (subdomain) {
            const location = response.headers.get('location')
            if (location) {
              const locationUrl = new URL(location)
              locationUrl.hostname = request.nextUrl.hostname
              response.headers.set('location', locationUrl.toString())
            }
          }
          return response
        }
      } else {
        response = NextResponse.next({ request })
      }
    } catch (error) {
      response = NextResponse.next({ request })
    }
  } else {
    response = NextResponse.next({ request })
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (subdomain) {
    const { locale, pathWithoutLocale } = extractLocaleFromPath(pathname)
    if (pathWithoutLocale.startsWith('/s/')) {
      return response
    }

    const { payload: exists } = await validateSubdomain(subdomain)

    if (!exists) {
      const url = new URL(request.url)
      url.hostname = rootDomain
      url.pathname = '/not-found'
      return NextResponse.redirect(url)
    }

    const currentLocale = locale || routing.defaultLocale

    if (pathWithoutLocale === '/') {
      const url = new URL(`/${currentLocale}/s/${subdomain}`, request.url)
      url.search = request.nextUrl.search
      return NextResponse.rewrite(url)
    }

    if (pathWithoutLocale === '/cart') {
      return NextResponse.rewrite(
        new URL(`/${currentLocale}/s/${subdomain}/cart`, request.url)
      )
    }

    if (pathWithoutLocale === '/checkout') {
      return NextResponse.rewrite(
        new URL(`/${currentLocale}/s/${subdomain}/checkout`, request.url)
      )
    }

    if (pathWithoutLocale.startsWith('/item/')) {
      const itemPath = pathWithoutLocale.split('/item/')[1]
      return NextResponse.rewrite(
        new URL(`/${currentLocale}/s/${subdomain}/item/${itemPath}`, request.url)
      )
    }

    return response
  }

  const { pathWithoutLocale } = extractLocaleFromPath(pathname)

  if (!user && (pathWithoutLocale === '/account' || pathWithoutLocale.includes('/dashboard'))) {
    const url = request.nextUrl.clone()
    url.hostname = rootDomain
    const { locale } = extractLocaleFromPath(pathname)
    url.pathname = `/${locale || routing.defaultLocale}/account`
    return NextResponse.redirect(url)
  }

  if (user && (pathWithoutLocale.includes('/login') || pathWithoutLocale.includes('/signup'))) {
    const url = request.nextUrl.clone()
    url.hostname = rootDomain
    const { locale } = extractLocaleFromPath(pathname)
    url.pathname = `/${locale || routing.defaultLocale}/account`
    return NextResponse.redirect(url)
  }

  return response
}