/* // utils/user-utils.ts
import { prisma } from "@/utils/prisma"


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


export async function getCurrentUserId(currentUser: any): Promise<number | null> {
  if (!currentUser?.id) return null
  
  return await resolveUserId(currentUser.id)
} */