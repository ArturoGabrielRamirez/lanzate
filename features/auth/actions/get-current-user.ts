// features/auth/actions/get-current-user.ts
"use server"

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"
import { createServerSideClient } from "@/utils/supabase/server"

/**
 * ✅ SINGLE SOURCE OF TRUTH
 * Siempre retorna el usuario de Prisma con ID numérico
 */
export async function getCurrentUser() {
  return actionWrapper(async () => {
    const supabase = createServerSideClient()
    const { data: { user: supabaseUser }, error } = await (await supabase).auth.getUser()

    if (error || !supabaseUser) {
      return {
        error: true,
        message: "Usuario no autenticado",
        payload: null
      }
    }

    // ✅ SIEMPRE buscar en Prisma y retornar usuario local
    let localUser = await prisma.user.findUnique({
      where: { supabase_user_id: supabaseUser.id },
      select: {
        id: true, // ✅ Número, no UUID
        username: true,
        email: true,
        avatar: true,
        banner: true,
        first_name: true,
        last_name: true,
        supabase_user_id: true,
        created_at: true,
        profile_is_public: true
      }
    })

    // Fallback: buscar por email si no existe supabase_user_id
    if (!localUser) {
      localUser = await prisma.user.findUnique({
        where: { email: supabaseUser.email! },
        select: {
          id: true,
          username: true,
          email: true,
          avatar: true,
          banner: true,
          first_name: true,
          last_name: true,
          supabase_user_id: true,
          created_at: true,
          profile_is_public: true
        }
      })

      // Sincronizar supabase_user_id si se encontró por email
      if (localUser) {
        await prisma.user.update({
          where: { id: localUser.id },
          data: { supabase_user_id: supabaseUser.id }
        })
      }
    }

    if (!localUser) {
      return {
        error: true,
        message: "Usuario no encontrado en la base de datos",
        payload: null
      }
    }

    return {
      error: false,
      message: "Usuario obtenido exitosamente",
      payload: localUser // ✅ Siempre con ID numérico
    }
  })
}

/**
 * ✅ ELIMINAR getLocalUser() - Ya no es necesario
 * getCurrentUser() ahora hace todo
 */