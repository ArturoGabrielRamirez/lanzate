// features/user-profile/actions/follow-actions.ts
'use server'

import { getCurrentUser } from "@/features/auth/actions"
import { actionWrapper, formatErrorResponse, formatSuccessResponse } from "@/utils/lib"
import { prisma } from "@/utils/prisma"
import { getCurrentUserId, resolveUserId } from "../utils/user-utils"
import { SocialActivityService } from "../services/social-activity-services"



export async function toggleFollowUser(targetUserId: number) {
  return actionWrapper(async () => {
    const currentUserResponse = await getCurrentUser()
    if (!currentUserResponse || currentUserResponse.error) {
      return formatErrorResponse("Debes iniciar sesión", null)
    }

    const currentUserId = await getCurrentUserId(currentUserResponse.payload)
    if (!currentUserId) {
      return formatErrorResponse("Usuario actual no encontrado", null)
    }

    if (currentUserId === targetUserId) {
      return formatErrorResponse("No puedes seguirte a ti mismo", null)
    }

    // Verificar que el usuario objetivo existe y es público
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { 
        id: true, 
        username: true, 
        profile_is_public: true,
        first_name: true,
        last_name: true
      }
    })

    if (!targetUser) {
      return formatErrorResponse("Usuario no encontrado", null)
    }

    if (!targetUser.profile_is_public) {
      return formatErrorResponse("No puedes seguir perfiles privados", null)
    }

    // Verificar estado actual de seguimiento
    const existingFollow = await prisma.userFollow.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: currentUserId,
          following_id: targetUserId
        }
      }
    })

    if (existingFollow) {
      // Dejar de seguir
      await prisma.$transaction([
        prisma.userFollow.delete({
          where: {
            follower_id_following_id: {
              follower_id: currentUserId,
              following_id: targetUserId
            }
          }
        }),
        // Eliminar actividad de seguimiento
        prisma.socialActivity.deleteMany({
          where: {
            user_id: currentUserId,
            activity_type:'USER_LOGIN' /* 'USER_FOLLOW' */,
           /*  followed_user_id: targetUserId */
          }
        })
      ])

      return formatSuccessResponse("Dejaste de seguir al usuario", {
        isFollowing: false,
        user: targetUser
      })
    } else {
      // Comenzar a seguir
      await prisma.$transaction(async (tx) => {
        // Crear el follow
        await tx.userFollow.create({
          data: {
            follower_id: currentUserId,
            following_id: targetUserId
          }
        })

        // Crear actividad social
        await SocialActivityService.createFollowActivity(
          currentUserId,
          targetUserId,
          targetUser.username
        )
      })

      return formatSuccessResponse("Usuario seguido exitosamente", {
        isFollowing: true,
        user: targetUser
      })
    }
  })
}

export async function checkIfFollowing(currentUserId: number | string, targetUserId: number) {
  return actionWrapper(async () => {
    const resolvedCurrentUserId = await resolveUserId(currentUserId)
    
    if (!resolvedCurrentUserId) {
      return formatSuccessResponse("Usuario no autenticado", { isFollowing: false })
    }

    const follow = await prisma.userFollow.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: resolvedCurrentUserId,
          following_id: targetUserId
        }
      }
    })

    return formatSuccessResponse("Estado verificado", {
      isFollowing: !!follow
    })
  })
}

export async function getUserFollowStats(userId: number) {
  return actionWrapper(async () => {
    const [followersCount, followingCount] = await Promise.all([
      prisma.userFollow.count({
        where: { following_id: userId }
      }),
      prisma.userFollow.count({
        where: { follower_id: userId }
      })
    ])

    return formatSuccessResponse("Estadísticas obtenidas", {
      followers: followersCount,
      following: followingCount
    })
  })
}