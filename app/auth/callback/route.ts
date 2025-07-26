import { insertUser } from '@/features/auth/data/insertUser'
import { getUserByEmail } from '@/features/layout/data/getUserByEmail'
import { createServerSideClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') ?? '/'
  
  // Obtener locale de los headers o usar el por defecto
  const acceptLanguage = request.headers.get('accept-language')
  const preferredLocale = acceptLanguage?.split(',')[0]?.split('-')[0]
  const locale = routing.locales.includes(preferredLocale as any) 
    ? preferredLocale 
    : routing.defaultLocale

    
    const envURL = process.env.NEXTAUTH_URL
    
    

  if (!code) {
    return NextResponse.redirect(`${envURL}/${locale}/auth/auth-code-error`)
  }

 /*  console.log(`urlOrigin: ${url.origin}`) */

  const supabase = await createServerSideClient()

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
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

  // Construir la URL de redirección con locale
  const redirectPath = next === '/' ? `/${locale}/account` : `/${locale}${next}`
  return NextResponse.redirect(`${envURL}${redirectPath}`)
}