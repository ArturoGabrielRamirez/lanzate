/* 'use server'

import { getCurrentUser } from "@/features/auth/actions"
import { actionWrapper, formatErrorResponse, formatSuccessResponse } from "@/utils/lib"

import { prisma } from "@/utils/prisma"
import { getUserActivitiesData,  } from "../data/get-user-profile"

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
      select: { id: true, profile_is_public: true }
    })

    if (!user) {
      return formatErrorResponse("Usuario no encontrado", null)
    }

    // Si se quieren actividades privadas, verificar permisos
    if (includePrivate) {
      const currentUserResponse = await getCurrentUser()
      
      if (!currentUserResponse?.payload) {
        return formatErrorResponse("No autorizado para ver actividades privadas", null)
      }

      // Verificar si es el mismo usuario
      const currentUser = currentUserResponse.payload
      let currentUserId: number | null = null
      
      if (typeof currentUser.id === 'string') {
        const dbUser = await prisma.user.findUnique({
          where: { supabase_user_id: currentUser.id },
          select: { id: true }
        })
        currentUserId = dbUser?.id || null
      } else {
        currentUserId = currentUser.id
      }
      
      if (currentUserId !== userId) {
        return formatErrorResponse("No tienes permisos para ver actividades privadas", null)
      }
    }

    // Si el perfil no es público y no se incluyen actividades privadas
    if (!user.profile_is_public && !includePrivate) {
      return formatErrorResponse("Perfil privado", null)
    }

    // Obtener actividades
    const { activities, totalActivities } = await getUserActivitiesData(
      userId, 
      limit, 
      offset, 
      includePrivate
    )

    // Generar actividades mock si es necesario
    const mockActivities = await generateMockActivitiesData(userId, limit)
    
    // Combinar actividades
    const combinedActivities = [
      ...activities,
      ...mockActivities.slice(0, Math.max(0, limit - activities.length))
    ]

    return formatSuccessResponse("Actividades obtenidas exitosamente", {
      activities: combinedActivities.slice(0, limit),
      pagination: {
        total: totalActivities + mockActivities.length,
        limit,
        offset,
        hasMore: offset + limit < (totalActivities + mockActivities.length)
      }
    })
  })
} */