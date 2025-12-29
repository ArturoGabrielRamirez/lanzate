'use server'

import { Prisma } from '@prisma/client'
import { unstable_cache } from 'next/cache'

import { prisma } from '@/utils/prisma'


// ✅ Cache de actividades (revalidar cada 60 segundos)
export const getCachedActivitiesData = unstable_cache(
    async (
        whereClause: Prisma.SocialActivityWhereInput,
        limit: number,
        offset: number
    ) => {
        return prisma.socialActivity.findMany({
            where: whereClause,
            select: {
                id: true,
                user_id: true,
                activity_type: true,
                entity_type: true,
                entity_id: true,
                title: true,
                description: true,
                metadata: true,
                is_public: true,
                is_featured: true,
                created_at: true,
                // ✅ Solo traer campos necesarios de relaciones
                product: {
                    select: {
                        id: true,
                        name: true,
                       /*  image: true, */
                        slug: true
                    }
                },
                store: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                        slug: true
                    }
                }
            },
            orderBy: { created_at: 'desc' },
            take: limit,
            skip: offset
        })
    },
    ['user-activities'],
    {
        revalidate: 60,
        tags: ['activities']
    }
)