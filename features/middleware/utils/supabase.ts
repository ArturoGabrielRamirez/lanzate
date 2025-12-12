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

    const { locale, pathWithoutLocale } = getLocaleAndPathname(request.nextUrl.pathname)
    const isPublicRoute = publicRoutes.includes(pathWithoutLocale)

    if (user && isPublicRoute) {
        return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
    }

    if (!user && !isPublicRoute && !isPublicProfileUrl(pathWithoutLocale)) {
        return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
    }

    return response;
}