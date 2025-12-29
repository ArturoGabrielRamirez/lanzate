import { createBrowserClient } from '@supabase/ssr';

// Cache del cliente para evitar recreaciones innecesarias
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  // Reutilizar cliente existente si está disponible
  if (supabaseClient) {
    return supabaseClient;
  }

  supabaseClient = createBrowserClient(
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
            // Configuración optimizada de cookies
            const cookieOptions = {
              ...options,
              domain: '.lanzate.app',
              path: '/',
              secure: !window.location.hostname.includes('localhost'),
              sameSite: 'lax' as const
            };

            let cookieString = `${name}=${value}`;
            
            if (cookieOptions.domain && !window.location.hostname.includes('localhost')) {
              cookieString += `; Domain=${cookieOptions.domain}`;
            }
            
            if (cookieOptions.path) {
              cookieString += `; Path=${cookieOptions.path}`;
            }
            
            if (cookieOptions.secure) {
              cookieString += `; Secure`;
            }
            
            if (cookieOptions.sameSite) {
              cookieString += `; SameSite=${cookieOptions.sameSite}`;
            }
            
            if (options?.maxAge) {
              cookieString += `; Max-Age=${options.maxAge}`;
            }

            document.cookie = cookieString;
          });
        },
      },
      auth: {
        // Configuraciones para mejorar rendimiento
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  );

  return supabaseClient;
}

// Función para limpiar el cliente (útil en desarrollo)
export function resetClient() {
  supabaseClient = null;
}