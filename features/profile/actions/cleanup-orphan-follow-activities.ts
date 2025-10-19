/* 'use server'

import { actionWrapper, formatErrorResponse, formatSuccessResponse } from "@/utils/lib"
import { prisma } from "@/utils/prisma"
import { findUserFollow } from "../data/find-user-follow"

export async function cleanupOrphanFollowActivities(userId: number) {
  return actionWrapper(async () => {
    try {
      // Encontrar actividades de "seguimiento" huérfanas
      const orphanActivities = await prisma.socialActivity.findMany({
        where: {
          user_id: userId,
          activity_type: 'USER_LOGIN', // Tipo temporal
          entity_type: 'USER',
          title: {
            startsWith: 'Siguió a @'
          }
        },
        select: {
          id: true,
          entity_id: true
        }
      })

      const cleanupResults = []

      for (const activity of orphanActivities) {
        // Verificar si el follow aún existe
        const followExists = await findUserFollow(userId, activity.entity_id!)

        // Si no existe el follow, eliminar la actividad huérfana
        if (!followExists) {
          await prisma.socialActivity.delete({
            where: { id: activity.id }
          })
          cleanupResults.push(activity.id)
        }
      }

      return formatSuccessResponse("Limpieza completada", {
        removedActivities: cleanupResults.length,
        activityIds: cleanupResults
      })
    } catch (error) {
      console.error('Error en limpieza de actividades:', error)
      return formatErrorResponse("Error en la limpieza", null)
    }
  })
} */