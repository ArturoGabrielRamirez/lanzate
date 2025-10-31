// features/profile/actions/toggle-follow-optimized.ts
"use server"


import { revalidateTag } from 'next/cache'

import { getCurrentUserWithIdAndEmailAction } from '@/features/auth/actions'
import { actionWrapper } from '@/features/global/utils'
import { prisma } from '@/utils/prisma'

export async function toggleFollowUserAction(targetUserId: number) {
  return actionWrapper(async () => {
    // 1. Validar usuario actual

    const { payload: currentUser, hasError: authError } = await getCurrentUserWithIdAndEmailAction()
    if (authError || !currentUser) throw new Error('No autenticado')

    if (currentUser.id === targetUserId) {
      throw new Error('No podés seguirte a vos mismo')
    }

    // 2. ✅ QUERY ÚNICA: Obtiene user + follow status + contadores
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        username: true,
        first_name: true,
        last_name: true,
        profile_is_public: true,
        // JOIN para verificar follow existente
        user_follows_following: {
          where: { follower_id: currentUser.id },
          select: { id: true }
        },
        // Contadores en la misma query
        _count: {
          select: {
            user_follows_following: true, // followers
            user_follows: true // following
          }
        }
      }
    })

    if (!targetUser) {
      throw new Error('Usuario no encontrado')
    }

    if (!targetUser.profile_is_public) {
      throw new Error('No puedes seguir perfiles privados')
    }

    // 3. ✅ Determinar acción desde JOIN (sin query adicional)
    const existingFollow = targetUser.user_follows_following.length > 0
    const shouldFollow = !existingFollow

    let isFollowing = false
    let followersCount = targetUser._count.user_follows_following
    const followingCount = targetUser._count.user_follows

    // 4. ✅ Transacción optimizada con menos operaciones
    await prisma.$transaction(async (tx) => {
      if (shouldFollow) {
        // Crear follow
        await tx.userFollow.create({
          data: {
            follower_id: currentUser.id,
            following_id: targetUserId
          }
        })

        followersCount += 1
        isFollowing = true

        // ✅ Actividad solo si show_activity está habilitado
        const userSettings = await tx.user.findUnique({
          where: { id: currentUser.id },
          select: { show_activity: true }
        })

        if (userSettings?.show_activity !== false) {
          const displayName = targetUser.first_name && targetUser.last_name
            ? `${targetUser.first_name} ${targetUser.last_name}`
            : targetUser.username

          await tx.socialActivity.create({
            data: {
              user_id: currentUser.id,
              activity_type: 'USER_LOGIN',
              entity_type: 'USER',
              entity_id: targetUserId,
              title: `Comenzó a seguir a ${displayName}`,
              description: `${currentUser.username} ahora sigue a @${targetUser.username}`,
              metadata: JSON.stringify({
                followedUser: {
                  id: targetUser.id,
                  username: targetUser.username,
                  displayName
                }
              }),
              is_public: true,
              is_featured: false
            }
          })
        }
      } else {
        // ✅ Eliminar follow Y actividad en una sola operación
        await Promise.all([
          tx.userFollow.deleteMany({
            where: {
              follower_id: currentUser.id,
              following_id: targetUserId
            }
          }),
          tx.socialActivity.deleteMany({
            where: {
              user_id: currentUser.id,
              activity_type: 'USER_LOGIN',
              entity_type: 'USER',
              entity_id: targetUserId
            }
          })
        ])

        followersCount = Math.max(0, followersCount - 1)
        isFollowing = false
      }
    })

    // 5. ✅ Revalidar solo tags necesarios
    revalidateTag(`user-${targetUserId}`)
    revalidateTag(`user-activities-${currentUser.id}`)

    return {
      hasError: false,
      message: isFollowing
        ? `Ahora sigues a @${targetUser.username}`
        : `Dejaste de seguir a @${targetUser.username}`,
      payload: {
        isFollowing,
        followersCount,
        followingCount
      }
    }
  })
}