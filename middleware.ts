import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { extractSubdomain } from '@/features/subdomain/middleware/middleware';
import { subdomainExists } from './features/subdomain/actions/subdomainExists';


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);

  if (subdomain) {
    // Verificar si el subdominio existe en Supabase
    const exists = await subdomainExists(subdomain);

    if (!exists) {
      // Si el subdominio no existe, redirigir a 404 o página principal
    /*   return NextResponse.redirect(new URL('/404', request.url)); */
    }

    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (pathname === '/') {
      return NextResponse.rewrite(new URL(`/s/${subdomain}`, request.url));
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!api|_next|[\\w-]+\\.\\w+).*)'
  ],
}