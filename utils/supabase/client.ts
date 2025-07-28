import { createBrowserClient } from '@supabase/ssr';

function getCookieDomain() {
  if (typeof window === 'undefined') return 'localhost';
  
  const hostname = window.location.hostname;
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost';
  
  return hostname.includes('localhost') ? 'localhost' : `.${rootDomain}`;
}

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          if (typeof document === 'undefined') return [];
          return document.cookie
            .split(';')
            .map(cookie => cookie.trim())
            .filter(cookie => cookie.length > 0)
            .map(cookie => {
              const [name, ...rest] = cookie.split('=');
              return {
                name: name.trim(),
                value: rest.join('=').trim()
              };
            });
        },
        setAll(cookiesToSet) {
          if (typeof document === 'undefined') return;
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookieOptions = {
              ...options,
              domain: getCookieDomain(),
              path: '/',
              secure: !window.location.hostname.includes('localhost'),
              sameSite: 'lax'
            };
            
            let cookieString = `${name}=${value}`;
            
            if (cookieOptions.domain) {
              //cookieString += `; Domain=${cookieOptions.domain}`;
              cookieString += `; Domain=localhost.com`;
            }
            
            if (cookieOptions.path) {
              cookieString += `; Path=${cookieOptions.path}`;
            }
            
            if (cookieOptions.secure) {
              cookieString += `; Secure`;
            }
            
            if (cookieOptions.sameSite) {
              //cookieString += `; SameSite=${cookieOptions.sameSite}`;
              cookieString += `; SameSite=Lax`;
            }
            
            if (cookieOptions.maxAge) {
              cookieString += `; Max-Age=${cookieOptions.maxAge}`;
            }
            
            document.cookie = cookieString;
          });
        },
      },
    }
  );
}