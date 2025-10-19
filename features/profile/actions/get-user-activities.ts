'use server'

import { Prisma } from '@prisma/client'
import { getCurrentUser } from '@/features/auth/actions'
import { actionWrapper, formatErrorResponse, formatSuccessResponse } from '@/utils/lib'
import { prisma } from '@/utils/prisma'
import { unstable_cache } from 'next/cache'
import { getCachedActivities } from '../data/get-cached-activities'

type GetUserActivitiesParams = {
    userId: number
    limit?: number
    offset?: number
    includePrivate?: boolean
}


export async function getUserActivitiesAction({
    userId,
    limit = 20,
    offset = 0,
    includePrivate = false
}: GetUserActivitiesParams) {
    return actionWrapper(async () => {
        // Validar userId
        if (isNaN(userId) || userId <= 0) {
            return formatErrorResponse('ID de usuario inválido', null)
        }

        // ✅ Verificar permisos para actividades privadas
        if (includePrivate) {
            const currentUserResponse = await getCurrentUser()

            if (!currentUserResponse?.payload || currentUserResponse.payload.id !== userId) {
                return formatErrorResponse('No autorizado para ver actividades privadas', null)
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
            return formatErrorResponse('Usuario no encontrado', null)
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
            return formatErrorResponse('Perfil privado', null)
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