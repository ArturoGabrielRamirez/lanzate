import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { extractSubdomain } from '@/features/subdomain/middleware/middleware';
import { validateSubdomain } from '@/features/subdomain/actions/validateSubdomain';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Detectar si estamos en un subdominio
  const subdomain = extractSubdomain(request);
  const { pathname } = request.nextUrl;

  // Si estamos en un subdominio, manejar lógica específica
  if (subdomain) {
    // Evitar bucle infinito - no procesar rutas que ya son rewrites
    if (pathname.startsWith('/s/')) {
      return supabaseResponse;
    }

    // Verificar si el subdominio existe
    const { payload: exists } = await validateSubdomain(subdomain);
    
    if (!exists) {
      // Redirigir al dominio principal si el subdominio no existe
      const url = new URL(request.url);
      url.hostname = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost';
      url.pathname = '/404';
      return NextResponse.redirect(url);
    }

    // Rutas protegidas en subdominio (si las necesitas)
    if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
      if (!user) {
        // Redirigir al login del dominio principal manteniendo el redirect
        const url = new URL(request.url);
        url.hostname = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost';
        url.pathname = '/login';
        url.searchParams.set('redirect', request.url);
        return NextResponse.redirect(url);
      }
    }

    // Bloquear acceso a admin desde subdominio
    if (pathname.startsWith('/admin')) {
      return NextResponse.rewrite(new URL('/404', request.url));
    }

    // Rewrite para mostrar la página de la tienda
    if (pathname === '/') {
      return NextResponse.rewrite(new URL(`/s/${subdomain}`, request.url));
    }

    // Para otras rutas en subdominio, continuar normalmente
    return supabaseResponse;
  }

  // Lógica original para el dominio principal
  if (
    !user &&
    (
      pathname === "/account" ||
      pathname.includes("/stores") ||
      pathname.includes("/dashboard")
    )
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (
    user &&
    (pathname.includes('login') || pathname.includes('signup'))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/account';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}