import { CookieOptions, createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

import { publicRoutes } from '@/features/middleware/constants';
import { getLocaleAndPathname } from '@/features/middleware/utils/get-locale-and-pathname';
import { isPublicProfileUrl } from '@/features/middleware/utils/is-public-profile-url';

export async function updateSession(request: NextRequest, response: NextResponse) {
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
                    /* cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    ); */
                    cookiesToSet.forEach(async ({ name, value, options }) => {
                        const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost';
                        const cookieOptions = {
                            ...options,
                            domain: 'lanzate.app',
                            path: '/',
                            secure: !rootDomain.includes('localhost'),
                            sameSite: 'lax' as const,
                        };
                        response.cookies.set(name, value, cookieOptions);
                    })
                },
            },
        }
    );

    const { data } = await supabase.auth.getClaims()
    const user = data?.claims

    // Get the rewritten pathname from next-intl middleware
    // The x-middleware-rewrite header contains the URL after the rewrite
    // If not present, try to extract from the request pathname (which may already include locale)
    const rewriteUrl = response.headers.get('x-middleware-rewrite');
    let pathnameToUse = request.nextUrl.pathname;
    
    if (rewriteUrl) {
        try {
            const rewritePathname = new URL(rewriteUrl).pathname;
            pathnameToUse = rewritePathname;
        } catch (e) {
            // If parsing fails, fall back to original pathname
            pathnameToUse = request.nextUrl.pathname;
        }
    }
    
    console.log("🚀 ~ updateSession ~ pathnameToUse:", pathnameToUse)
    const { locale, pathWithoutLocale } = getLocaleAndPathname(pathnameToUse)
    const isPublicRoute = publicRoutes.includes(pathWithoutLocale)

    //if the user is logged in and the route is public, redirect to the dashboard
    if (user && isPublicRoute) {
        return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
    }

    //if the user is not logged in and the route is not public, redirect to the login page
    if (!user && !isPublicRoute && !isPublicProfileUrl(pathWithoutLocale)) {
        return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
    }

    return response;
}