import { routing } from '@/i18n/routing'
import { UserDeletionSystem } from '@/features/account/utils/user-deletion-system'
import { CryptoUtils } from '@/features/account/utils/crypto-utils'
import { insertUser } from '@/features/auth/data/insertUser'
import { SupabaseClient, User } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'

export function detectOAuthCancellation(error: string | null, errorDescription: string | null): boolean {
  if (!error) return false

  const cancellationErrors = [
    'access_denied',
    'user_cancelled_authorize',
    'user_cancelled_login'
  ]

  const cancellationDescriptions = [
    'user denied',
    'user cancelled',
    'user canceled',
    'permissions error',
    'authorization denied',
    'the user denied the request'
  ]

  if (cancellationErrors.includes(error.toLowerCase())) return true

  if (errorDescription) {
    const lowerDesc = errorDescription.toLowerCase()
    return cancellationDescriptions.some(phrase => lowerDesc.includes(phrase))
  }

  return false
}

export function buildErrorRedirectUrl(
  baseUrl: string,
  locale: string,
  errorType: 'oauth_error' | 'missing_code' | 'exchange_failed' | 'user_fetch_failed' | 'account_deleted' | 'email_in_use' | 'validation_failed' | 'user_creation_failed' | 'unexpected_error',
  errorMessage?: string,
  originalError?: string
): string {
  const errorParams = new URLSearchParams()

  switch (errorType) {
    case 'missing_code':
      errorParams.set('error', 'missing_code')
      errorParams.set('error_description', 'Authorization code not provided')
      break
    case 'exchange_failed':
      errorParams.set('error', 'exchange_failed')
      errorParams.set('error_description', errorMessage || 'Failed to exchange code for session')
      break
    case 'account_deleted':
      errorParams.set('error', 'account_deleted')
      errorParams.set('error_description', 'This account has been permanently deleted and cannot be recovered. You can create a new account with the same email if needed.')
      break
    case 'email_in_use':
      errorParams.set('error', 'email_in_use')
      errorParams.set('error_description', 'Email already in use by another active account')
      break
    case 'user_creation_failed':
      errorParams.set('error', 'user_creation_failed')
      errorParams.set('error_description', errorMessage || 'Failed to create user record')
      break
    case 'validation_failed':
      errorParams.set('error', 'validation_failed')
      errorParams.set('error_description', errorMessage || 'User validation failed')
      break
    case 'unexpected_error':
      errorParams.set('error', 'unexpected_error')
      errorParams.set('error_description', 'An unexpected error occurred during authentication')
      break
    default:
      errorParams.set('error', originalError || errorType)
      if (errorMessage) {
        errorParams.set('error_description', errorMessage)
      }
  }

  return `${baseUrl}/${locale}/auth/error?${errorParams.toString()}`
}

export function extractRequestParams(request: Request) {
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

  return { url, code, error, error_description, next, subdomain, locale, baseUrl }
}


export async function handleAnonymizedUserCheck(user: User, request: Request, supabase: SupabaseClient, prisma: PrismaClient) {
  if (!user.email) return { isAnonymized: false, shouldBlock: false }

  const emailHash = CryptoUtils.hashEmail(user.email)

  const anonymizedUser = await prisma.user.findFirst({
    where: {
      AND: [
        {
          OR: [
            { supabase_user_id: user.id },
            {
              AND: [
                { original_email_hash: emailHash },
                { supabase_user_id: null }
              ]
            }
          ]
        },
        { is_anonymized: true }
      ]
    },
    select: {
      id: true,
      email: true,
      supabase_user_id: true,
      anonymized_at: true,
      original_email_hash: true,
    }
  })

  if (!anonymizedUser) return { isAnonymized: false, shouldBlock: false }

  console.error(`🚫 Intento de acceso a cuenta anonimizada: ${user.email} (Usuario ID: ${anonymizedUser.id})`)

  // Limpiar conexión huérfana si existe
  if (anonymizedUser.supabase_user_id === user.id) {
    try {
      await supabase.auth.admin.deleteUser(anonymizedUser.supabase_user_id)
      await prisma.user.update({
        where: { id: anonymizedUser.id },
        data: { supabase_user_id: null }
      })
      console.error(`🧹 Conexión huérfana limpiada para usuario ${anonymizedUser.id}`)
    } catch (cleanupError) {
      console.error('❌ Error limpiando conexión huérfana:', cleanupError)
    }
  }

  // Log del intento bloqueado
  try {
    await prisma.userDeletionLog.create({
      data: {
        user_id: anonymizedUser.id,
        action: 'BLOCKED_ACCESS',
        reason: 'Attempted access to anonymized account',
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
        additional_data: JSON.stringify({
          supabase_user_id: user.id,
          email: user.email,
          blocked_at: new Date().toISOString(),
          match_type: anonymizedUser.supabase_user_id === user.id ? 'supabase_id' : 'email_hash',
        }),
      },
    })
  } catch (logError) {
    console.error('❌ Error logging blocked access:', logError)
  }

  return { isAnonymized: true, shouldBlock: true }
}

export async function handleUserCreationOrUpdate(user: User, prisma: PrismaClient) {
  const existingUser = await prisma.user.findFirst({
    where: {
      supabase_user_id: user.id,
      is_anonymized: false,
    }
  })

  let userId = existingUser?.id
  let wasNewAccount = false
  let wasMigrated = false

  if (!existingUser && user?.email) {
    try {
      const validation = await UserDeletionSystem.validateNewUserCreation(user.email)

      if (!validation.canCreate && validation.conflict) {
        console.error(`❌ Email ${user.email} ya está en uso por cuenta activa`)
        return {
          error: true,
          errorType: 'email_in_use' as const,
          message: 'Email already in use by another active account'
        }
      }

    } catch (validationError) {
      console.error('❌ Error en validación:', validationError)
      if (validationError instanceof Error && validationError.message.includes('already exists')) {
        return {
          error: true,
          errorType: 'validation_failed' as const,
          message: validationError.message
        }
      }
    }

    const provider = user?.app_metadata?.provider || 'oauth'
    const insertResult = await insertUser(
      user?.email ?? "",
      provider,
      user?.id ?? "",
      user?.user_metadata?.avatar_url ?? null,
      user?.user_metadata?.username ?? null,
      user?.user_metadata?.name ?? null,
      user?.user_metadata?.lastname ?? null,
      user?.user_metadata?.phone ?? null
    )

    if (insertResult.error || !insertResult.payload) {
      console.error('❌ Error inserting user into database:', insertResult.message)
      return {
        error: true,
        errorType: 'user_creation_failed' as const,
        message: insertResult.message || 'Failed to create user record'
      }
    }

    const newUser = insertResult.payload
    userId = newUser.id
    wasNewAccount = true

  } else if (existingUser && !existingUser.supabase_user_id) {
    // Migrar usuario existente
    try {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          email: user?.email || existingUser.email,
          supabase_user_id: user?.id || existingUser.supabase_user_id,
          avatar: user?.user_metadata?.avatar_url || existingUser.avatar,
          first_name: user?.user_metadata?.name || existingUser.first_name,
          last_name: user?.user_metadata?.lastname || existingUser.last_name,
          phone: user?.user_metadata?.phone || existingUser.phone,
          created_at: existingUser.created_at,
          updated_at: new Date()
        }
      })
      wasMigrated = true
    } catch (error) {
      console.error('❌ Error migrating user:', error)
      console.error('Error migrating user:', existingUser.email)
    }

  } else if (existingUser) {
    // Actualizar usuario existente
    if (user?.user_metadata?.avatar_url) {
      try {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            avatar: user.user_metadata.avatar_url,
            first_name: user.user_metadata.name || existingUser.first_name,
            last_name: user.user_metadata.lastname || existingUser.last_name,
            phone: user.user_metadata.phone || existingUser.phone,
            updated_at: new Date()
          }
        })
      } catch (error) {
        console.error('❌ Error updating user profile:', error)
      }
    }
  }

  return {
    error: false,
    userId,
    wasNewAccount,
    wasMigrated
  }
}

export function buildSuccessRedirectUrl(baseUrl: string, locale: string, next: string, subdomain: string | null): string {
  if (subdomain) {
    const redirectPath = next === '/' ? `/${locale}` : `/${locale}${next}`
    return `${baseUrl}/${locale}/auth/redirect?subdomain=${subdomain}&path=${encodeURIComponent(redirectPath)}`
  } else {
    const redirectPath = next === '/' ? `/${locale}/dashboard` : `/${locale}${next}`
    return `${baseUrl}${redirectPath}`
  }
}