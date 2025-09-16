// features/user-profile/data/get-user-profile.ts
import { prisma } from "@/utils/prisma"
import { PublicUserProfile } from "../types"

const DEFAULT_BANNERS = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=400&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=400&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=400&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=400&fit=crop",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=400&fit=crop",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&h=400&fit=crop",
  "https://images.unsplash.com/photo-1464822759356-8d6106e78f86?w=1920&h=400&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=400&fit=crop"
]

export const getDefaultBannerForUser = (userId: number): string => {
  const index = userId % DEFAULT_BANNERS.length
  return DEFAULT_BANNERS[index]
}

export async function getUserProfileData(username: string): Promise<PublicUserProfile | null> {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
      profile_is_public: true,
    },
    select: {
      id: true,
      username: true,
      first_name: true,
      last_name: true,
      avatar: true,
      banner: true,
      profile_bio: true,
      location: true,
      created_at: true,
      profile_is_public: true,
      show_liked_products: true,
      show_comments: true,
      show_activity: true,
      show_location: true,
      supabase_user_id: true,
      // Usar agregación directa de Prisma para mejor rendimiento
      _count: {
        select: {
          product_likes: true,
          product_comments: true,
          /* followers: true,  */   // Corregido: contadores directos
        /*   following: true,  */   // Corregido: contadores directos
        }
      }
    }
  })

  if (!user) {
    return null
  }

  // Banner con fallback
  const bannerToShow = user.banner || getDefaultBannerForUser(user.id)

  return {
    ...user,
    banner: bannerToShow,
    _count: {
      product_likes: user._count.product_likes,
      product_comments: user._count.product_comments,
      user_follows: user._count.product_likes/* followers */,           // Seguidores
      user_follows_following: user._count.product_likes/* following */, // Siguiendo
    }
  }
}

// Función optimizada para obtener actividades de usuario SIN mock
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
        },
      /*   followed_user: {
          select: {
            id: true,
            username: true,
            avatar: true,
            first_name: true,
            last_name: true
          }
        } */
      },
      orderBy: {
        created_at: 'desc'
      },
      take: limit,
      skip: offset
    }),
    prisma.socialActivity.count({ where: whereClause })
  ])

  return { activities, totalActivities: total }
}

// ELIMINAR generateMockActivitiesData - ya no es necesario
// En su lugar, crear actividades reales cuando ocurren las acciones

export async function getUserLikedProductsData(
  userId: number,
  limit: number = 20,
  offset: number = 0
) {
  const [likedProducts, totalLiked] = await Promise.all([
    prisma.product_likes.findMany({
      where: {
        user_id: userId,
        products: {
          is_active: true,
          is_published: true,
          is_deleted: false
        }
      },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            image: true,
            slug: true,
            is_active: true,
            is_featured: true,
            created_at: true,
            store: {
              select: {
                id: true,
                name: true,
                logo: true,
                slug: true,
                subdomain: true,
                is_active: true
              }
            }
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      },
      take: limit,
      skip: offset
    }),
    prisma.product_likes.count({
      where: {
        user_id: userId,
        products: {
          is_active: true,
          is_published: true,
          is_deleted: false
        }
      }
    })
  ])

  return { likedProducts, totalLiked }
}