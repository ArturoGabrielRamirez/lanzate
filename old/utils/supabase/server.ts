import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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
              const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost';
              const cookieOptions = {
                ...options,
                //domain: rootDomain.includes('localhost') ? 'localhost' : `.${rootDomain}`,
                //domain: 'localhost.com',
                domain: 'lanzate.app',
                path: '/',
                secure: !rootDomain.includes('localhost'),
                sameSite: 'lax' as const,
              };

              (await cookieStore).set(name, value, cookieOptions);
            });
          } catch (error) {
            // En algunos contextos del servidor no se pueden establecer cookies
            console.log("🚀 ~ setAll ~ error:", error)
          }
        },
      }/* ,
      auth: {
        flowType: "pkce"
      } */
    }
  );
}