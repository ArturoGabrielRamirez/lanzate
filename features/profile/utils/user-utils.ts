// utils/user-utils.ts
import { prisma } from "@/utils/prisma"

/**
 * Convierte cualquier ID de usuario (string UUID o number) a number
 * Útil para manejar la diferencia entre IDs de Supabase y de la BD local
 */
export async function resolveUserId(userId: string | number): Promise<number | null> {
  if (typeof userId === 'number') {
    return userId
  }

  // Si es string (UUID de Supabase), buscar el ID numérico
  const user = await prisma.user.findUnique({
    where: { supabase_user_id: userId },
    select: { id: true }
  })

  return user?.id || null
}

/**
 * Obtiene el ID numérico del usuario actual
 */
export async function getCurrentUserId(currentUser: any): Promise<number | null> {
  if (!currentUser?.id) return null
  
  return await resolveUserId(currentUser.id)
}