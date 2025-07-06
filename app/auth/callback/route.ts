import { insertUser } from '@/features/auth/data/insertUser'
import { getUserByEmail } from '@/features/layout/data/getUserByEmail'
import { createClient } from '@/utils/supabase/server-props'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') ?? '/'

  if (!code) {
    return NextResponse.redirect(`${url.origin}/auth/auth-code-error`)
  }

  const supabase = await createClient()

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
  if (exchangeError) {
    console.error('Error exchanging code for session:', exchangeError)
    return NextResponse.redirect(`${url.origin}/auth/auth-code-error`)
  }


  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    console.error('Error getting user:', userError)
    return NextResponse.redirect(`${url.origin}/auth/auth-code-error`)
  }

  const { payload: existingUser } = await getUserByEmail(user.email ?? "")


  if (!existingUser) {
    const { error: insertError } = await insertUser(user.email ?? "", "email")

    if (insertError) {
      console.error('Error inserting user into users:', insertError)
      return NextResponse.redirect(`${url.origin}/auth/auth-code-error`)
    }
  }

  return NextResponse.redirect(`${url.origin}${next}/account`)
}