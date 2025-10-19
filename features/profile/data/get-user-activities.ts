/* 'use server'

import { getCurrentUser } from "@/features/auth/actions"
import { actionWrapper, formatErrorResponse, formatSuccessResponse } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

import { getUserActivitiesData } from "./get-user-activity-data"

export async function getUserActivities(
  userId: number,
  limit: number = 20,
  offset: number = 0,
  includePrivate: boolean = false
) {
  return actionWrapper(async () => {
    if (!userId || typeof userId !== 'number') {
      return formatErrorResponse("ID de usuario inválido", null)
    }

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        profile_is_public: true,
        username: true
      }
    })

    if (!user) {
      return formatErrorResponse("Usuario no encontrado", null)
    }

    // Verificar permisos para actividades privadas
    if (includePrivate) {
      const currentUserResponse = await getCurrentUser()

      if (!currentUserResponse?.payload) {
        return formatErrorResponse("No autorizado para ver actividades privadas", null)
      }

      const currentUserId = await getCurrentUser()

      if (currentUserId.payload !== userId) {
        return formatErrorResponse("No tienes permisos para ver actividades privadas", null)
      }
    }

    // Si el perfil no es público y no incluye privadas
    if (!user.profile_is_public && !includePrivate) {
      return formatErrorResponse("Perfil privado", null)
    }

    // Obtener actividades REALES (sin mock)
    const { activities, totalActivities } = await getUserActivitiesData(
      userId,
      limit,
      offset,
      includePrivate
    )

    return formatSuccessResponse("Actividades obtenidas exitosamente", {
      activities,
      user: {
        username: user.username,
        id: user.id
      },
      pagination: {
        total: totalActivities,
        limit,
        offset,
        hasMore: offset + limit < totalActivities,
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(totalActivities / limit)
      }
    })
  })
} */