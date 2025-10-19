/* import { prisma } from "@/utils/prisma"

export async function getUserActivitiesData(
    userId: number,
    limit: number = 20,
    offset: number = 0,
    includePrivate: boolean = false
) {
    const whereClause: any = { user_id: userId }

    if (!includePrivate) {
        whereClause.is_public = true
    }

    const [activities, total] = await Promise.all([
        prisma.socialActivity.findMany({
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
                }, */
                /*   followed_user: {
                    select: {
                      id: true,
                      username: true,
                      avatar: true,
                      first_name: true,
                      last_name: true
                    }
                  } */
            /* },
            orderBy: {
                created_at: 'desc'
            },
            take: limit,
            skip: offset
        }),
        prisma.socialActivity.count({ where: whereClause })
    ])

    return { activities, totalActivities: total }
} */