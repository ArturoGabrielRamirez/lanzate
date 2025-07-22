import { createServerClient } from '@supabase/ssr'
import createIntlMiddleware from 'next-intl/middleware'

import { NextResponse, type NextRequest } from 'next/server'
import { extractSubdomain } from '@/features/subdomain/middleware/middleware'
import { validateSubdomain } from '@/features/subdomain/actions/validateSubdomain'
import { routing } from '@/i18n/routing'

// Crear el middleware de internacionalización
const intlMiddleware = createIntlMiddleware(routing)

// Función para verificar si una ruta necesita i18n
function shouldApplyI18n(pathname: string, subdomain: string | null): boolean {
  // No aplicar i18n en rutas de API, archivos estáticos, o rutas especiales
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/s/') ||
    pathname.includes('.')
  ) {
    return false
  }
  
  // No aplicar i18n en subdominios para ciertas rutas específicas
  if (subdomain && (pathname === '/' || pathname.startsWith('/item/') || pathname === '/cart' || pathname === '/checkout')) {
    return false
  }
  
  return true
}

export async function updateSession(request: NextRequest) {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost.com'
  const subdomain = extractSubdomain(request)
  const { pathname } = request.nextUrl
  
  // 1. PRIMERO: Aplicar internacionalización si es necesario
  let response: NextResponse
  
  if (shouldApplyI18n(pathname, subdomain)) {
    try {
      const intlResponse = intlMiddleware(request)
      if (intlResponse) {
        response = intlResponse
        // Si hay redirección de i18n, ejecutarla inmediatamente
        if (response.status === 307 || response.status === 308 || response.headers.get('location')) {
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

  // 3. TERCERO: Obtener usuario (IMPORTANTE: No modificar esta sección)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 4. CUARTO: Lógica de subdominio (tu lógica actual)
  if (subdomain) {
    if (pathname.startsWith('/s/')) return response

    const { payload: exists } = await validateSubdomain(subdomain)

    if (!exists) {
      const url = new URL(request.url)
      url.hostname = rootDomain
      url.pathname = '/404'
      return NextResponse.redirect(url)
    }

   /*  if (pathname.startsWith('/admin')) {
      return NextResponse.rewrite(new URL('/404', request.url))
    } */
/* 
    if (pathname.startsWith('/dashboard') && !user) {
      const url = new URL(request.url)
      url.hostname = rootDomain
      url.pathname = '/test1'
      url.searchParams.set('redirect', request.url)
      return NextResponse.redirect(url)
    } */

    if (pathname === '/') {
      const url = new URL(`/s/${subdomain}`, request.url)
      url.search = request.nextUrl.search
      return NextResponse.rewrite(url)
    }

    if (pathname === '/cart') {
      return NextResponse.rewrite(new URL(`/s/${subdomain}/cart`, request.url))
    }

    if (pathname === '/checkout') {
      return NextResponse.rewrite(new URL(`/s/${subdomain}/checkout`, request.url))
    }

    if (pathname.startsWith('/item/')) {
      return NextResponse.rewrite(
        new URL(`/s/${subdomain}/item/${pathname.split('/item/')[1]}`, request.url)
      )
    }

    return response
  }

  // 5. QUINTO: Lógica de dominio raíz con autenticación
  if (!user && (pathname === '/account' || pathname.includes('/dashboard'))) {
    const url = request.nextUrl.clone()
    url.hostname = rootDomain
    url.pathname = '/account'
    return NextResponse.redirect(url)
  }

  if (user && (pathname.includes('/login') || pathname.includes('/signup'))) {
    const url = request.nextUrl.clone()
    url.hostname = rootDomain
    url.pathname = '/account'
    return NextResponse.redirect(url)
  }

  // 6. FINALMENTE: Retornar la respuesta con todas las cookies de Supabase
  return response
}