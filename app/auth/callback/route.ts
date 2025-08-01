import { insertUser } from '@/features/auth/data/insertUser'
import { getUserByEmail } from '@/features/layout/data/getUserByEmail'
import { createServerSideClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') ?? '/'
  const subdomain = url.searchParams.get('subdomain')

  const acceptLanguage = request.headers.get('accept-language')
  const preferredLocale = acceptLanguage?.split(',')[0]?.split('-')[0]
  const locale = routing.locales.includes(preferredLocale as typeof routing.locales[number])
    ? preferredLocale
    : routing.defaultLocale

  const mainDomainURL = `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'lanzate.app'}`

  if (!code) {
    return NextResponse.redirect(`${mainDomainURL}/${locale}/error`)
  }

  const supabase = await createServerSideClient()

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
  if (exchangeError) {
    console.error('Error exchanging code for session:', exchangeError)
    return NextResponse.redirect(`${mainDomainURL}/${locale}/error`)
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    console.error('Error getting user:', userError)
    return NextResponse.redirect(`${mainDomainURL}/${locale}/error`)
  }

  const { payload: existingUser } = await getUserByEmail(user.email ?? "")

  if (!existingUser) {
    const { error: insertError } = await insertUser(user.email ?? "", "email")
    if (insertError) {
      console.error('Error inserting user into users:', insertError)
      return NextResponse.redirect(`${mainDomainURL}/${locale}/error`)
    }
  }

  if (subdomain) {
    const redirectPath = next === '/' ? `/${locale}` : `/${locale}${next}`

    const intermediateURL = `${mainDomainURL}/${locale}/auth/redirect?subdomain=${subdomain}&path=${encodeURIComponent(redirectPath)}`
    return NextResponse.redirect(intermediateURL)
  } else {
    const redirectPath = next === '/' ? `/${locale}/account` : `/${locale}${next}`
    return NextResponse.redirect(`${mainDomainURL}${redirectPath}`)
  }
}