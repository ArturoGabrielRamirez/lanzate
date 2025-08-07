import { insertUser } from '@/features/auth/data/insertUser'
import { getUserByEmail } from '@/features/layout/data/getUserByEmail'
import { insertLogEntry } from '@/features/layout/data/insertLogEntry'
import { createServerSideClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'
import { prisma } from '@/utils/prisma'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  const error_description = url.searchParams.get('error_description')
  const next = url.searchParams.get('next') ?? '/'
  const subdomain = url.searchParams.get('subdomain')

  const acceptLanguage = request.headers.get('accept-language')
  const preferredLocale = acceptLanguage?.split(',')[0]?.split('-')[0]
  const locale = routing.locales.includes(preferredLocale as typeof routing.locales[number])
    ? preferredLocale
    : routing.defaultLocale

  const baseUrl = subdomain 
    ? `https://${subdomain}.lanzate.app` 
    : `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'lanzate.app'}`

  if (error) {
    // ... mismo manejo de errores ...
    console.error('OAuth error:', error, error_description)
    const errorParams = new URLSearchParams()
    // ... resto del código de error igual ...
  }

  if (!code) {
    // ... mismo manejo ...
  }

  const supabase = await createServerSideClient()

  try {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code as string)
    if (exchangeError) {
      // ... mismo manejo de error ...
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      // ... mismo manejo de error ...
    }

    // 👈 CAMBIO IMPORTANTE: Buscar primero por supabase_user_id
    let existingUser = await prisma.user.findUnique({
      where: {
        supabase_user_id: user?.id
      }
    });

    // Si no se encuentra por supabase_user_id, buscar por email (usuarios antiguos)
    if (!existingUser) {
      const { error: getUserError, payload: userByEmail } = await getUserByEmail(user?.email ?? "")
      
      if (getUserError) {
        console.error('Error fetching user by email:', getUserError)
        // ... manejo de error ...
      }

      existingUser = userByEmail;
    }

    let userId = existingUser?.id

    if (!existingUser) {
      // Crear nuevo usuario
      const provider = user?.app_metadata?.provider || 'oauth'
      
      // 👈 PASAR EL SUPABASE_USER_ID AL CREAR USUARIO
      const { error: insertError, payload: newUser } = await insertUser(
        user?.email ?? "", 
        provider,
        user?.id // 👈 NUEVO PARÁMETRO
      )
      
      if (insertError || !newUser) {
        console.error('Error inserting user into users:', insertError)
        // ... manejo de error ...
      }
      
      userId = newUser.id
    } else if (!existingUser.supabase_user_id) {
      // Usuario existente sin supabase_user_id - actualizar
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          supabase_user_id: user?.id,
          email: user?.email!, // Sincronizar email también
          updated_at: new Date()
        }
      });
      
      console.log(`✅ Usuario migrado en OAuth: ${existingUser.id} -> supabase_user_id: ${user?.id}`);
    }

    if (userId) {
      const provider = user?.app_metadata?.provider || 'oauth'
      insertLogEntry({
        action: "LOGIN",
        entity_type: "USER",
        entity_id: userId,
        user_id: userId,
        action_initiator: `${provider} OAuth`,
        details: `User signed in using ${provider} OAuth`
      }).catch(console.error)
    }

  } catch (unexpectedError) {
    console.error('Unexpected error in auth callback:', unexpectedError)
    // ... manejo de error ...
  }

  // ... resto del código de redirección igual ...
  if (subdomain) {
    const redirectPath = next === '/' ? `/${locale}` : `/${locale}${next}`
    const intermediateURL = `${baseUrl}/${locale}/auth/redirect?subdomain=${subdomain}&path=${encodeURIComponent(redirectPath)}`
    return NextResponse.redirect(intermediateURL)
  } else {
    const redirectPath = next === '/' ? `/${locale}/dashboard` : `/${locale}${next}`
    return NextResponse.redirect(`${baseUrl}${redirectPath}`)
  }
}