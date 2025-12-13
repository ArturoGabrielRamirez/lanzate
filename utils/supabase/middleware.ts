import { NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'

import { checkUserDeletionStatus } from '@/features/account/utils/check-deletion-status'
import { Locale, routing } from '@/i18n/routing'
import { createServerSideClient } from '@/utils/supabase/server'

import type { User } from '@supabase/supabase-js'

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

  if (routing.locales.includes(firstSegment as Locale)) {
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

function isPublicProfileRoute(pathWithoutLocale: string): boolean {
  return pathWithoutLocale.match(/^\/u\/[a-zA-Z0-9_-]+$/) !== null
}

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  )
}

export async function updateSession(request: NextRequest) {

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'lanzate.app'
  const { pathname } = request.nextUrl

  let response: NextResponse = NextResponse.next()

  if (shouldApplyI18n(pathname)) {
    const intlResponse = intlMiddleware(request)

    if (intlResponse.ok === false) {
      return intlResponse
    }

    response = intlResponse
  }

  const isApiRoute = pathname.startsWith('/api/')
  const isStaticAssetRequest = isStaticAsset(pathname)

  if (isApiRoute || isStaticAssetRequest) {
    return response
  }

  const supabase = createServerSideClient()

  let user: User | null = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (error) {
    user = null
  }

  const { locale, pathWithoutLocale } = extractLocaleFromPath(pathname)
  const currentLocale = locale || routing.defaultLocale

  // 🚨 BLOQUEO POR ELIMINACIÓN - RE-AGREGAR ESTA SECCIÓN
  if (user) {
    try {
      // Usamos el cliente 'supabase' y el 'user.id'
      const deletionStatus = await checkUserDeletionStatus(supabase, user.id)

      // Si el usuario está en proceso de eliminación y NO está anonimizado
      if (deletionStatus?.isDeletionRequested && !deletionStatus.isAnonymized) {

        // Definir rutas que SÍ están permitidas
        const isAccountRoute = pathWithoutLocale === '/account'
        const isAuthRoute = pathname.startsWith('/auth/')
        const isNextRoute = pathname.startsWith('/_next/')
        const isFavicon = pathname.startsWith('/favicon')

        const isAllowedRoute =
          isAccountRoute ||
          isApiRoute ||
          isAuthRoute ||
          isNextRoute ||
          isFavicon ||
          isStaticAssetRequest

        // Si NO está en una ruta permitida, redirigir a /account
        if (!isAllowedRoute) {
          console.log(`🚫 Bloqueando acceso a ${pathname} - Usuario en eliminación diferida`)
          const url = new URL(`/${currentLocale}/account`, request.url)
          return NextResponse.redirect(url)
        }
      }
    } catch (error) {
      console.error('Error verificando estado de eliminación:', error)
      // En caso de error, permitir continuar (fail-open para no bloquear usuarios)
    }
  }
  // FIN BLOQUEO POR ELIMINACIÓN


  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/reset-password',
    '/privacy-policy',
    '/terms-and-conditions',
    '/cookies',
    '/help',
    '/waitlist',
    '/waitlist-success',
    '/about',
  ]

  const isPublicProfile = isPublicProfileRoute(pathWithoutLocale)

  // Redirecciones de autenticación simples
  if (!user && !publicRoutes.includes(pathWithoutLocale) && !isPublicProfile) {
    const url = new URL(`/${currentLocale}/login`, `https://${rootDomain}`)
    return NextResponse.redirect(url)
  }

  if (user && publicRoutes.includes(pathWithoutLocale)) {
    const url = new URL(`/${currentLocale}/dashboard`, `https://${rootDomain}`)
    return NextResponse.redirect(url)
  }

  return response
}