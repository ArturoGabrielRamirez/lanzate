// features/profile/actions/get-profile-with-follow.ts
'use server'

import { prisma } from "@/utils/prisma"
import { actionWrapper, formatSuccessResponse } from "@/utils/lib"
import { getCurrentUser } from "@/features/auth/actions" // ✅ Ahora retorna Prisma user

export async function getProfileWithFollowStatus(username: string) {
  return actionWrapper(async () => {
    // 1. Obtener currentUser (ya viene con ID numérico de Prisma)
    const { payload: currentUser } = await getCurrentUser()
    
    // 2. ✅ SINGLE OPTIMIZED QUERY con JOIN condicional
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        first_name: true,
        last_name: true,
        avatar: true,
        banner: true,
        profile_bio: true,
        location: true,
        profile_is_public: true,
        show_liked_products: true,
        show_comments: true,
        show_activity: true,
        show_location: true,
        supabase_user_id: true,
        created_at: true,
        _count: {
          select: {
            user_follows_following: true, // followers
            user_follows: true, // following
            product_likes: true
          }
        },
        // ✅ JOIN para obtener follow status en MISMA query
        ...(currentUser && {
          user_follows_following: {
            where: {
              follower_id: currentUser.id // ✅ Ya es número
            },
            select: { id: true }
          }
        })
      }
    })

    if (!user) {
      return {
        error: true,
        message: 'Usuario no encontrado',
        payload: null
      }
    }

    // 3. ✅ Calcular isFollowing del JOIN (sin query adicional)
    const isFollowing = currentUser 
      ? (user.user_follows_following as any[] || []).length > 0
      : false

    // 4. Limpiar response
    const { user_follows_following, ...userData } = user

    return formatSuccessResponse('Perfil obtenido', {
      user: userData,
      currentUser, // ✅ ID numérico
      isFollowing // ✅ Calculado sin query extra
    })
  })
}