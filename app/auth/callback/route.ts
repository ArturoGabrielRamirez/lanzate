import { insertUser } from '@/features/auth/data/insertUser'
import { getUserByEmail } from '@/features/layout/data/getUserByEmail'
import { createServerSideClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') ?? '/'

  const acceptLanguage = request.headers.get('accept-language')
  const preferredLocale = acceptLanguage?.split(',')[0]?.split('-')[0]
  const locale = routing.locales.includes(preferredLocale as typeof routing.locales[number])
    ? preferredLocale
    : routing.defaultLocale


  const envURL = process.env.NEXTAUTH_URL || `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`



  if (!code) {
    return NextResponse.redirect(`${envURL}/${locale}/auth/auth-code-error`)
  }

  const supabase = await createServerSideClient();
  
  console.log("🚀 ~ GET ~ cookies:", (await cookies()).getAll())
  console.log("🚀 ~ GET ~ code:", code)

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  console.log("🚀 ~ GET ~ exchangeError:", exchangeError)

  if (exchangeError) {
    console.error('Error exchanging code for session:', exchangeError)
    return NextResponse.redirect(`${envURL}/${locale}/auth/auth-code-error`)
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    console.error('Error getting user:', userError)
    return NextResponse.redirect(`${envURL}/${locale}/auth/auth-code-error`)
  }

  const { payload: existingUser } = await getUserByEmail(user.email ?? "")

  if (!existingUser) {
    const { error: insertError } = await insertUser(user.email ?? "", "email")

    if (insertError) {
      console.error('Error inserting user into users:', insertError)
      return NextResponse.redirect(`${envURL}/${locale}/auth/auth-code-error`)
    }
  }

  const redirectPath = next === '/' ? `/${locale}/account` : `/${locale}${next}`
  return NextResponse.redirect(`${envURL}${redirectPath}`)
}