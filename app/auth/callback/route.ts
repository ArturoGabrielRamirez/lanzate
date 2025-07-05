import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server-props'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  const next = searchParams.get('next') ?? '/'
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    console.log(error)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}/account`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}/account`)
      } else {
        return NextResponse.redirect(`${origin}${next}/account`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}