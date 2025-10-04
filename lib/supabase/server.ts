import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { APP_CONFIG } from '@/features/global/constants';

export function createServerSideClient() {
    const cookieStore = cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                async getAll() {
                    return (await cookieStore).getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(async ({ name, value, options }) => {
                            const cookieOptions = {
                                ...options,
                                domain: APP_CONFIG.COOKIE_DOMAIN,
                                path: '/',
                                secure: APP_CONFIG.IS_PRODUCTION,
                                sameSite: 'lax' as const,
                            };

                            (await cookieStore).set(name, value, cookieOptions);
                        });
                    } catch (error) {
                        // En algunos contextos del servidor no se pueden establecer cookies
                        console.error("Error setting cookies:", error);
                    }
                },
            }
        }
    );
}

