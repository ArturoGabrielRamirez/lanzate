import { insertUser } from '@/features/auth/data/insertUser'
import { insertLogEntry } from '@/features/layout/data/insertLogEntry'
import { createServerSideClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'
import { prisma } from '@/utils/prisma'
import { UserDeletionSystem } from '@/features/account/utils/user-deletion-system'
import { CryptoUtils } from '@/features/account/utils/crypto-utils'

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
    errorParams.set('error', error)
    if (error_description) {
      errorParams.set('error_description', error_description)
    }

    const errorRedirectPath = `/${locale}/auth/error?${errorParams.toString()}`
    return NextResponse.redirect(`${baseUrl}${errorRedirectPath}`)
  }

  if (!code) {
    console.error('No authorization code provided')
    const errorParams = new URLSearchParams()
    errorParams.set('error', 'missing_code')
    errorParams.set('error_description', 'Authorization code not provided')

    const errorRedirectPath = `/${locale}/auth/error?${errorParams.toString()}`
    return NextResponse.redirect(`${baseUrl}${errorRedirectPath}`)
  }

  const supabase = await createServerSideClient()

  try {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code as string)
    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError)
      const errorParams = new URLSearchParams()
      errorParams.set('error', 'exchange_failed')
      errorParams.set('error_description', exchangeError.message)

      const errorRedirectPath = `/${locale}/auth/error?${errorParams.toString()}`
      return NextResponse.redirect(`${baseUrl}${errorRedirectPath}`)
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('Error getting user after OAuth:', userError)
      const errorParams = new URLSearchParams()
      errorParams.set('error', 'user_fetch_failed')
      errorParams.set('error_description', userError?.message || 'Unable to fetch user data')

      const errorRedirectPath = `/${locale}/auth/error?${errorParams.toString()}`
      return NextResponse.redirect(`${baseUrl}${errorRedirectPath}`)
    }

    const emailHash = user.email ? CryptoUtils.hashEmail(user.email) : null

    const anonymizedUser = await prisma.user.findFirst({
      where: {
        AND: [
          {
            OR: [
              { supabase_user_id: user.id },
              ...(emailHash ? [{ 
                AND: [
                  { original_email_hash: emailHash },
                  { supabase_user_id: null }
                ]
              }] : [])
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
    });

    if (anonymizedUser) {
      console.error(`🚫 Intento de acceso a cuenta anonimizada: ${user.email} (Usuario ID: ${anonymizedUser.id})`);
    
      if (anonymizedUser.supabase_user_id === user.id) {
        try {
          await supabase.auth.admin.deleteUser(anonymizedUser.supabase_user_id);
          await prisma.user.update({
            where: { id: anonymizedUser.id },
            data: { supabase_user_id: null }
          });
          
          console.log(`🧹 Conexión huérfana limpiada para usuario ${anonymizedUser.id}`);
        } catch (cleanupError) {
          console.error('❌ Error limpiando conexión huérfana:', cleanupError);
        }
      }

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
        });
      } catch (logError) {
        console.error('Error logging blocked access:', logError);
      }

      const errorParams = new URLSearchParams()
      errorParams.set('error', 'account_deleted')
      errorParams.set('error_description', 'This account has been permanently deleted and cannot be recovered. You can create a new account with the same email if needed.')

      const errorRedirectPath = `/${locale}/auth/error?${errorParams.toString()}`
      return NextResponse.redirect(`${baseUrl}${errorRedirectPath}`)
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        supabase_user_id: user.id,
        is_anonymized: false,
      }
    });

    let userId = existingUser?.id

    if (!existingUser && user?.email) {
      try {
        const validation = await UserDeletionSystem.validateNewUserCreation(user.email)

        if (!validation.canCreate && validation.conflict) {
          console.error(`❌ Email ${user.email} ya está en uso por cuenta activa`)
          const errorParams = new URLSearchParams()
          errorParams.set('error', 'email_in_use')
          errorParams.set('error_description', 'Email already in use by another active account')

          const errorRedirectPath = `/${locale}/auth/error?${errorParams.toString()}`
          return NextResponse.redirect(`${baseUrl}${errorRedirectPath}`)
        }

        if (validation.previouslyAnonymized) {
          console.log(`ℹ️ Creando nueva cuenta para email previamente anonimizado: ${user.email}`);
        }
      } catch (validationError) {
        console.error('❌ Error en validación:', validationError)
        if (validationError instanceof Error && validationError.message.includes('already exists')) {
          const errorParams = new URLSearchParams()
          errorParams.set('error', 'validation_failed')
          errorParams.set('error_description', validationError.message)

          const errorRedirectPath = `/${locale}/auth/error?${errorParams.toString()}`
          return NextResponse.redirect(`${baseUrl}${errorRedirectPath}`)
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
        const errorParams = new URLSearchParams()
        errorParams.set('error', 'user_creation_failed')
        errorParams.set('error_description', insertResult.message || 'Failed to create user record')

        const errorRedirectPath = `/${locale}/auth/error?${errorParams.toString()}`
        return NextResponse.redirect(`${baseUrl}${errorRedirectPath}`)
      }
      const newUser = insertResult.payload
      userId = newUser.id

    } else if (existingUser && !existingUser.supabase_user_id) {
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
        });
      } catch (error) {
        console.error('❌ Error migrating user', error)
        console.error('Error migrating user:', existingUser.email)
      }

    } else if (existingUser) {
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
          });
        } catch (error) {
          console.error('❌ Error updating user profile:', error)
        }
      }
    }

    if (userId) {
      const provider = user?.app_metadata?.provider || 'oauth'
      const wasNewAccount = !existingUser
      const wasMigrated = existingUser && !existingUser.supabase_user_id

      insertLogEntry({
        action: "LOGIN",
        entity_type: "USER",
        entity_id: userId,
        user_id: userId,
        action_initiator: `${provider} OAuth`,
        details: `User signed in using ${provider} OAuth${wasNewAccount ? ' (new account)' : ''}${wasMigrated ? ' (migrated account)' : ''}`
      }).catch(error => {
        console.error('❌ Error logging OAuth signin:', error)
      })
    }

  } catch (unexpectedError) {
    console.error('❌ Unexpected error in auth callback:', unexpectedError)
    const errorParams = new URLSearchParams()
    errorParams.set('error', 'unexpected_error')
    errorParams.set('error_description', 'An unexpected error occurred during authentication')

    const errorRedirectPath = `/${locale}/auth/error?${errorParams.toString()}`
    return NextResponse.redirect(`${baseUrl}${errorRedirectPath}`)
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