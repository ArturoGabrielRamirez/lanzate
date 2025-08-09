import { insertUser } from '@/features/auth/data/insertUser'
import { getUserByEmail } from '@/features/layout/data/getUserByEmail'
import { insertLogEntry } from '@/features/layout/data/insertLogEntry'
import { createServerSideClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'
import { prisma } from '@/utils/prisma'

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

    let existingUser = await prisma.user.findUnique({
      where: {
        supabase_user_id: user?.id
      }
    });

    if (!existingUser) {
      const { error: getUserError, payload: userByEmail } = await getUserByEmail(user?.email ?? "")

      if (getUserError) {
        console.error('Error getting user by email:', getUserError)
      }

      existingUser = userByEmail;
    }

    let userId = existingUser?.id

    if (!existingUser) {
      const provider = user?.app_metadata?.provider || 'oauth'

      const insertResult = await insertUser(
        user?.email ?? "",
        provider,
        user?.id
      )

      if (insertResult.error || !insertResult.payload) {
        console.error('Error inserting user into database:', insertResult.message)
        const errorParams = new URLSearchParams()
        errorParams.set('error', 'user_creation_failed')
        errorParams.set('error_description', insertResult.message || 'Failed to create user record')

        const errorRedirectPath = `/${locale}/auth/error?${errorParams.toString()}`
        return NextResponse.redirect(`${baseUrl}${errorRedirectPath}`)
      }

      const newUser = insertResult.payload

      userId = newUser.id

    } else if (!existingUser.supabase_user_id) {
      try {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            supabase_user_id: user?.id || existingUser.supabase_user_id,
            email: user?.email || existingUser.email,
            created_at: new Date(),
            updated_at: new Date()
          }
        });

        console.error('User migrated to supabase_user_id:', existingUser.email)
      } catch (error) {
        console.error('Error migrating user', error)
        console.error('Error migrating user:', existingUser.email)
      }

    } else {
      console.error('User already logged in:', existingUser.email)
    }

    if (userId) {
      const provider = user?.app_metadata?.provider || 'oauth'
      insertLogEntry({
        action: "LOGIN",
        entity_type: "USER",
        entity_id: userId,
        user_id: userId,
        action_initiator: `${provider} OAuth`,
        details: `User signed in using ${provider} OAuth`
      }).catch(error => {
        console.error('Error logging OAuth signin:', error)
      })
    }

  } catch (unexpectedError) {
    console.error('Unexpected error in auth callback:', unexpectedError)
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