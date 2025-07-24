import { createServerClient } from '@supabase/ssr'
import createIntlMiddleware from 'next-intl/middleware'

import { NextResponse, type NextRequest } from 'next/server'
import { extractSubdomain } from '@/features/subdomain/middleware/middleware'
import { validateSubdomain } from '@/features/subdomain/actions/validateSubdomain'
import { routing } from '@/i18n/routing'

// Crear el middleware de internacionalización
const intlMiddleware = createIntlMiddleware(routing)

// Función para verificar si una ruta necesita i18n
function shouldApplyI18n(pathname: string): boolean {
  // No aplicar i18n en rutas de API, archivos estáticos
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return false
  }
  return true
}

// Función para extraer locale de la URL
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

  // 1. PRIMERO: Aplicar internacionalización (tanto para dominio raíz como subdominios)
  let response: NextResponse

  if (shouldApplyI18n(pathname)) {
    try {
      const intlResponse = intlMiddleware(request)
      if (intlResponse) {
        response = intlResponse
        // Si hay redirección de i18n, manejar subdominios
        if (response.status === 307 || response.status === 308 || response.headers.get('location')) {
          if (subdomain) {
            // Si es un subdominio y hay redirección de locale, ajustar la URL
            const location = response.headers.get('location')
            if (location) {
              const locationUrl = new URL(location)
              // Mantener el subdominio en la redirección
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
      // Si hay error con i18n, continuar sin él
      response = NextResponse.next({ request })
    }
  } else {
    response = NextResponse.next({ request })
  }

  // 2. SEGUNDO: Configurar Supabase con las cookies correctas
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

  // 3. TERCERO: Obtener usuario
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 4. CUARTO: Lógica de subdominio (CON internacionalización)
  if (subdomain) {
    // Extraer locale del pathname actual
    const { locale, pathWithoutLocale } = extractLocaleFromPath(pathname)

    // Si ya está en una ruta /locale/s/, no hacer nada
    if (pathWithoutLocale.startsWith('/s/')) {
      return response
    }

    // Validar que el subdominio existe
    const { payload: exists } = await validateSubdomain(subdomain)

    if (!exists) {
      const url = new URL(request.url)
      url.hostname = rootDomain
      url.pathname = '/not-found'
      return NextResponse.redirect(url)
    }

    // Determinar locale a usar (el de la URL o el por defecto)
    const currentLocale = locale || routing.defaultLocale

    // Reescribir rutas de subdominio CON locale
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

  // 5. QUINTO: Lógica de dominio raíz CON internacionalización
  const { pathWithoutLocale } = extractLocaleFromPath(pathname)

  if (!user && (pathWithoutLocale === '/account' /* || pathWithoutLocale.includes('/dashboard') */)) {
    const url = request.nextUrl.clone()
    url.hostname = rootDomain
    // Mantener el locale en la redirección
    const { locale } = extractLocaleFromPath(pathname)
    url.pathname = `/${locale || routing.defaultLocale}/account`
    return NextResponse.redirect(url)
  }

  if (user && (pathWithoutLocale.includes('/login') || pathWithoutLocale.includes('/signup'))) {
    const url = request.nextUrl.clone()
    url.hostname = rootDomain
    // Mantener el locale en la redirección
    const { locale } = extractLocaleFromPath(pathname)
    url.pathname = `/${locale || routing.defaultLocale}/account`
    return NextResponse.redirect(url)
  }

  // 6. FINALMENTE: Retornar la respuesta con todas las cookies de Supabase
  return response
}