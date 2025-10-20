'use server'

import { Prisma } from '@prisma/client'


import { getCurrentUser } from '@/features/auth/actions'
import { actionWrapper, formatErrorResponse, formatSuccessResponse } from '@/features/global/utils'
import { getCachedActivities } from '@/features/profile/data/get-cached-activities'
import { GetUserActivitiesParams } from '@/features/profile/types'
import { prisma } from '@/utils/prisma'

export async function getUserActivitiesAction({
    userId,
    limit = 20,
    offset = 0,
    includePrivate = false
}: GetUserActivitiesParams) {
    return actionWrapper(async () => {
        // Validar userId
        if (isNaN(userId) || userId <= 0) {
            return formatErrorResponse('ID de usuario inválido')
        }

        // ✅ Verificar permisos para actividades privadas
        if (includePrivate) {
            const currentUserResponse = await getCurrentUser()

            if (!currentUserResponse?.payload || currentUserResponse.payload.id !== userId) {
                return formatErrorResponse('No autorizado para ver actividades privadas')
            }
        }

        // ✅ Query única con usuario y validación de privacidad
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                profile_is_public: true,
                show_activity: true
            }
        })

        if (!user) {
            return formatErrorResponse('Usuario no encontrado')
        }

        // Verificar si el usuario permite mostrar actividades
        if (!user.show_activity && !includePrivate) {
            return formatSuccessResponse('Actividades ocultas', {
                activities: [],
                pagination: {
                    total: 0,
                    limit,
                    offset,
                    hasMore: false
                }
            })
        }

        // Verificar privacidad del perfil
        if (!user.profile_is_public && !includePrivate) {
            return formatErrorResponse('Perfil privado')
        }

        // Construir filtros
        const whereClause: Prisma.SocialActivityWhereInput = {
            user_id: userId
        }

        if (!includePrivate) {
            whereClause.is_public = true
        }

        // ✅ Usar cache para actividades frecuentes
        const [activities, totalActivities] = await Promise.all([
            getCachedActivities(whereClause, limit, offset),
            prisma.socialActivity.count({ where: whereClause })
        ])

        return formatSuccessResponse('Actividades obtenidas exitosamente', {
            activities,
            pagination: {
                total: totalActivities,
                limit,
                offset,
                hasMore: offset + limit < totalActivities
            }
        })
    })
}