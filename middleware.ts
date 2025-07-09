import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { extractSubdomain } from '@/features/subdomain/middleware'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const subdomain = extractSubdomain(request)
  if (subdomain) {
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(
        new URL(`/`, request.url)
      )
    }
    if (pathname === '/') {
      return NextResponse.rewrite(new URL(`/s/${subdomain}`, request.url));
    }
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!api|_next|[\\w-]+\\.\\w+).*)'
  ],
}