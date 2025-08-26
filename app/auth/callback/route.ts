import { insertUser } from '@/features/auth/data/insertUser'
import { insertLogEntry } from '@/features/layout/data/insertLogEntry'
import { createServerSideClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'
import { prisma } from '@/utils/prisma'
import { UserDeletionSystem } from '@/features/account/utils/user-deletion-system'
import { CryptoUtils } from '@/features/account/utils/crypto-utils'
import { buildErrorRedirectUrl, buildSuccessRedirectUrl, detectOAuthCancellation, extractRequestParams, handleAnonymizedUserCheck, handleUserCreationOrUpdate } from './utils'


export async function GET(request: Request) {
  const { url, code, error, error_description, next, subdomain, locale, baseUrl } = extractRequestParams(request)

  // 1. Manejo de errores OAuth con detección de cancelaciones
  if (error) {
    const isCancellation = detectOAuthCancellation(error, error_description)
    
    if (isCancellation) {
      console.log('OAuth login cancelled by user:', error, error_description)
      const cancelParams = new URLSearchParams()
      cancelParams.set('info', 'login_cancelled')
      cancelParams.set('message', 'Inicio de sesión cancelado')
      const loginRedirectPath = `/${locale}/login?${cancelParams.toString()}`
      return NextResponse.redirect(`${baseUrl}${loginRedirectPath}`)
    }
    
    console.error('OAuth error:', error, error_description)
    const errorUrl = buildErrorRedirectUrl(baseUrl, locale as string, 'oauth_error', error_description as string, error as string)
    return NextResponse.redirect(errorUrl)
  }

  // 2. Validar código de autorización
  if (!code) {
    console.error('No authorization code provided')
    const errorUrl = buildErrorRedirectUrl(baseUrl, locale as string, 'missing_code')
    return NextResponse.redirect(errorUrl)
  }

  const supabase = await createServerSideClient()

  try {
    // 3. Intercambiar código por sesión
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError)
      const errorUrl = buildErrorRedirectUrl(baseUrl, locale as string, 'exchange_failed', exchangeError.message)
      return NextResponse.redirect(errorUrl)
    }

    // 4. Obtener usuario autenticado
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('Error getting user after OAuth:', userError)
      const errorUrl = buildErrorRedirectUrl(baseUrl, locale as string, 'user_fetch_failed', userError?.message)
      return NextResponse.redirect(errorUrl)
    }

    // 5. Verificar si es una cuenta anonimizada
    const anonymizedCheck = await handleAnonymizedUserCheck(user, request, supabase, prisma)
    if (anonymizedCheck.shouldBlock) {
      const errorUrl = buildErrorRedirectUrl(baseUrl, locale as string, 'account_deleted')
      return NextResponse.redirect(errorUrl)
    }

    // 6. Crear o actualizar usuario
    const userResult = await handleUserCreationOrUpdate(user, prisma)
    if (userResult.error) {
      console.error('Error in user creation/update:', userResult.message)
      const errorUrl = buildErrorRedirectUrl(baseUrl, locale as string, userResult.errorType || "validation_failed", userResult.message)
      return NextResponse.redirect(errorUrl)
    }

    // 7. Log de actividad
    if (userResult.userId) {
      const provider = user?.app_metadata?.provider || 'oauth'
      insertLogEntry({
        action: "LOGIN",
        entity_type: "USER",
        entity_id: userResult.userId,
        user_id: userResult.userId,
        action_initiator: `${provider} OAuth`,
        details: `User signed in using ${provider} OAuth${userResult.wasNewAccount ? ' (new account)' : ''}${userResult.wasMigrated ? ' (migrated account)' : ''}`
      }).catch(error => console.error('❌ Error logging OAuth signin:', error))
    }

    // 8. Redirección final
    const successUrl = buildSuccessRedirectUrl(baseUrl, locale as string, next, subdomain)
    return NextResponse.redirect(successUrl)

  } catch (unexpectedError) {
    console.error('❌ Unexpected error in auth callback:', unexpectedError)
    const errorUrl = buildErrorRedirectUrl(baseUrl, locale as string, 'unexpected_error')
    return NextResponse.redirect(errorUrl)
  }
}