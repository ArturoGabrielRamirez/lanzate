import { insertUser } from '@/features/auth/data/insertUser'
import { getUserByEmail } from '@/features/layout/data/getUserByEmail'
import { createServerSideClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const next = url.searchParams.get('next') ?? '/'

  // Parsear el state si existe
  let stateData = null
  if (state) {
    try {
      stateData = JSON.parse(atob(state))
    } catch (error) {
      console.error('Error parsing state:', error)
    }
  }

  const acceptLanguage = request.headers.get('accept-language')
  const preferredLocale = acceptLanguage?.split(',')[0]?.split('-')[0]
  const locale = routing.locales.includes(preferredLocale as typeof routing.locales[number])
    ? preferredLocale
    : routing.defaultLocale

  // CORRECCIÓN: Usar el origin de la request actual
  const requestOrigin = url.origin
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'lanzate.app'
  
  // Determinar si estamos en un subdominio
  const hostname = url.hostname
  const isSubdomain = hostname !== rootDomain && hostname.endsWith(`.${rootDomain}`)
  
  // Para redirects de error, usar siempre el dominio principal
  const errorRedirectUrl = `https://${rootDomain}`

  if (!code) {
    console.error('No code provided in callback')
    return NextResponse.redirect(`${errorRedirectUrl}/not-found`)
  }

  const supabase = await createServerSideClient();

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    console.error('Error exchanging code for session:', exchangeError)
    return NextResponse.redirect(`${errorRedirectUrl}/not-found`)
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    console.error('Error getting user:', userError)
    return NextResponse.redirect(`${errorRedirectUrl}/not-found`)
  }

  const { payload: existingUser } = await getUserByEmail(user.email ?? "")

  if (!existingUser) {
    const { error: insertError } = await insertUser(user.email ?? "", "email")

    if (insertError) {
      console.error('Error inserting user into users:', insertError)
      return NextResponse.redirect(`${errorRedirectUrl}/not-found`)
    }
  }

  // CORRECCIÓN: Usar el origin del state si está disponible
  const redirectOrigin = stateData?.origin || (isSubdomain ? requestOrigin : `https://${rootDomain}`)
  const redirectPath = next === '/' ? `/${locale}/account` : `/${locale}${next}`
  
  console.log('Successful auth redirect:', { 
    redirectOrigin, 
    redirectPath, 
    isSubdomain,
    hostname,
    stateData 
  })
  
  return NextResponse.redirect(`${redirectOrigin}${redirectPath}`)
}