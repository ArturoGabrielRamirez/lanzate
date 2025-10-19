/* import { prisma } from "@/utils/prisma"
import { Prisma } from "@prisma/client"

export async function findActivities(
    whereClause: Prisma.SocialActivityWhereInput,
    limit: number,
    offset: number
) {
    return prisma.socialActivity.findMany({
        where: whereClause,
        include: {
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
            },
            order: {
                select: {
                    id: true,
                    total_price: true,
                    status: true
                }
            }
        },
        orderBy: {
            created_at: 'desc'
        },
        take: limit,
        skip: offset
    })
} */