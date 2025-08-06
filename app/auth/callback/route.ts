import { insertUser } from '@/features/auth/data/insertUser'
import { getUserByEmail } from '@/features/layout/data/getUserByEmail'
import { insertLogEntry } from '@/features/layout/data/insertLogEntry'
import { createServerSideClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  const error_description = url.searchParams.get('error_description')
  const next = url.searchParams.get('next') ?? '/'
  const subdomain = url.searchParams.get('subdomain')

  const acceptLanguage = request.headers.get('accept-language')
  const preferredLocale = acceptLanguage?.split(',')[0]?.split('-')[0]
  const locale = routing.locales.includes(preferredLocale as typeof routing.locales[number])
    ? preferredLocale
    : routing.defaultLocale

  const baseUrl = subdomain 
    ? `https://${subdomain}.lanzate.app` 
    : `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'lanzate.app'}`

  if (error) {
    console.error('OAuth error:', error, error_description)
    
    const errorParams = new URLSearchParams()
    
    switch (error) {
      case 'access_denied':
        errorParams.set('error', 'cancelled')
        errorParams.set('message', 'Se canceló el inicio de sesión')
        break
      case 'invalid_request':
        errorParams.set('error', 'invalid')
        errorParams.set('message', 'Solicitud de autenticación inválida')
        break
      case 'temporarily_unavailable':
        errorParams.set('error', 'temporary')
        errorParams.set('message', 'Servicio temporalmente no disponible')
        break
      case 'server_error':
        errorParams.set('error', 'server_error')
        errorParams.set('message', 'Error del servidor de autenticación')
        break
      case 'invalid_scope':
        errorParams.set('error', 'scope_error')
        errorParams.set('message', 'Permisos de acceso incorrectos')
        break
      default:
        errorParams.set('error', 'oauth_failed')
        errorParams.set('message', error_description || 'Error de autenticación')
    }
    
    if (subdomain) {
      errorParams.set('subdomain', subdomain)
    }
    
    if (next && next !== '/') {
      errorParams.set('next', next)
    }
    
    const redirectUrl = `${baseUrl}/${locale}/login?${errorParams.toString()}`
    return NextResponse.redirect(redirectUrl)
  }

  if (!code) {
    const errorParams = new URLSearchParams({
      error: 'no_code',
      message: 'No se recibió código de autorización'
    })
    
    if (subdomain) errorParams.set('subdomain', subdomain)
    if (next && next !== '/') errorParams.set('next', next)
    
    return NextResponse.redirect(`${baseUrl}/${locale}/login?${errorParams.toString()}`)
  }

  const supabase = await createServerSideClient()

  try {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError)
      
      const errorParams = new URLSearchParams({
        error: 'exchange_failed',
        message: 'Error al procesar la autenticación'
      })
      
      if (subdomain) errorParams.set('subdomain', subdomain)
      if (next && next !== '/') errorParams.set('next', next)
      
      return NextResponse.redirect(`${baseUrl}/${locale}/login?${errorParams.toString()}`)
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('Error getting user:', userError)
      
      const errorParams = new URLSearchParams({
        error: 'user_fetch_failed',
        message: 'Error al obtener información del usuario'
      })
      
      if (subdomain) errorParams.set('subdomain', subdomain)
      if (next && next !== '/') errorParams.set('next', next)
      
      return NextResponse.redirect(`${baseUrl}/${locale}/login?${errorParams.toString()}`)
    }

    const { error: getUserError, payload: existingUser } = await getUserByEmail(user.email ?? "")
    
    if (getUserError) {
      console.error('Error fetching user by email:', getUserError)
      
      const errorParams = new URLSearchParams({
        error: 'user_lookup_failed',
        message: 'Error al verificar usuario existente'
      })
      
      if (subdomain) errorParams.set('subdomain', subdomain)
      if (next && next !== '/') errorParams.set('next', next)
      
      return NextResponse.redirect(`${baseUrl}/${locale}/login?${errorParams.toString()}`)
    }

    let userId = existingUser?.id

    if (!existingUser) {
      const provider = user.app_metadata?.provider || 'oauth'
      
      const { error: insertError, payload: newUser } = await insertUser(user.email ?? "", provider)
      if (insertError || !newUser) {
        console.error('Error inserting user into users:', insertError)
        
        const errorParams = new URLSearchParams({
          error: 'user_creation_failed',
          message: 'Error al crear el usuario en el sistema'
        })
        
        if (subdomain) errorParams.set('subdomain', subdomain)
        if (next && next !== '/') errorParams.set('next', next)
        
        return NextResponse.redirect(`${baseUrl}/${locale}/login?${errorParams.toString()}`)
      }
      
      userId = newUser.id
    }

    if (userId) {
      const provider = user.app_metadata?.provider || 'oauth'
      insertLogEntry({
        action: "LOGIN",
        entity_type: "USER",
        entity_id: userId,
        user_id: userId,
        action_initiator: `${provider} OAuth`,
        details: `User signed in using ${provider} OAuth`
      }).catch(console.error)
    }

  } catch (unexpectedError) {
    console.error('Unexpected error in auth callback:', unexpectedError)
    
    const errorParams = new URLSearchParams({
      error: 'unexpected',
      message: 'Error inesperado durante la autenticación'
    })
    
    if (subdomain) errorParams.set('subdomain', subdomain)
    if (next && next !== '/') errorParams.set('next', next)
    
    return NextResponse.redirect(`${baseUrl}/${locale}/login?${errorParams.toString()}`)
  }

  if (subdomain) {
    const redirectPath = next === '/' ? `/${locale}` : `/${locale}${next}`
    const intermediateURL = `${baseUrl}/${locale}/auth/redirect?subdomain=${subdomain}&path=${encodeURIComponent(redirectPath)}`
    return NextResponse.redirect(intermediateURL)
  } else {
    const redirectPath = next === '/' ? `/${locale}/dashboard` : `/${locale}${next}`
    return NextResponse.redirect(`${baseUrl}${redirectPath}`)
  }
}