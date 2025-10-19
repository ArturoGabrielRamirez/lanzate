/* import { prisma } from "@/utils/prisma"
import { Prisma } from "@prisma/client"

export async function getActivitiesPaginated(
    userId: number,
    options: {
        limit?: number
        offset?: number
        includePrivate?: boolean
        types?: string[]
    } = {}
) {
    const {
        limit = 20,
        offset = 0,
        includePrivate = false,
        types
    } = options

    const whereClause: Prisma.SocialActivityWhereInput = {
        user_id: userId,
        ...((!includePrivate) && { is_public: true }),
        ...(types && types.length > 0 && {
            activity_type: { in: types as any }
        })
    }

    // ✅ Query única con count
    return prisma.$transaction([
        prisma.socialActivity.findMany({
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
                product: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
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
        }),
        prisma.socialActivity.count({ where: whereClause })
    ])
} */