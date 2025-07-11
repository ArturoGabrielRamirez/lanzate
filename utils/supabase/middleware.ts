import { NextResponse, type NextRequest } from 'next/server';
import { extractSubdomain } from '@/features/subdomain/middleware/middleware';
import { validateSubdomain } from '@/features/subdomain/actions/validateSubdomain';
import { createMiddlewareSupabaseClient } from './middleware-client';
import { createServerSideClient } from './server';


export async function updateSession(request: NextRequest) {
  const response = NextResponse.next();

  //const supabase = createMiddlewareSupabaseClient(request, response);
  const supabase = createServerSideClient()
  /* 
    DO NOT CODE BETWEEN THESE COMMENTS
  */
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost.com';
  const subdomain = extractSubdomain(request);
  console.log("🚀 ~ updateSession ~ subdomain:", subdomain)
  const { pathname } = request.nextUrl;

  if (subdomain) {
    console.log("🚀 ~ updateSession ~ subdomain:", subdomain)
    if (pathname.startsWith('/s/')) return response;

    const { payload: exists } = await validateSubdomain(subdomain);

    if (!exists) {
      const url = new URL(request.url);
      url.hostname = rootDomain;
      url.pathname = '/404';
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith('/admin')) {
      return NextResponse.rewrite(new URL('/404', request.url));
    }

    if (pathname.startsWith('/dashboard') && !user) {
      const url = new URL(request.url);
      url.hostname = rootDomain;
      url.pathname = '/test1';
      url.searchParams.set('redirect', request.url);
      return NextResponse.redirect(url);
    }

    if (pathname === '/') {
      return NextResponse.rewrite(new URL(`/s/${subdomain}`, request.url));
    }

    if (pathname === '/cart') {
      return NextResponse.rewrite(new URL(`/s/${subdomain}/cart`, request.url));
    }


    return response;
  }

  // Dominio raíz
  if (!user && (pathname === '/account' || pathname.includes('/dashboard'))) {
    console.log("🚀 ~ updateSession ~ pathname:", "First condition")
    const url = request.nextUrl.clone();
    url.hostname = "localhost.com";
    url.pathname = '/account';
    return NextResponse.redirect(url);
  }

  if (user && (pathname.includes('/login') || pathname.includes('/signup'))) {
    console.log("🚀 ~ updateSession ~ pathname:", "Second condition")
    const url = request.nextUrl.clone();
    url.hostname = "localhost.com";
    url.pathname = '/account';
    return NextResponse.redirect(url);
  }

  return response;
}
