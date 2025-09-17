import { prisma } from "@/utils/prisma"
import { SocialActivityType } from "@prisma/client"

interface CreateActivityData {
  userId: number
  activityType: SocialActivityType
  entityType: 'PRODUCT' | 'STORE' | 'ORDER' | 'USER'
  entityId: number
  title: string
  description?: string
  isPublic?: boolean
  isFeatured?: boolean
  metadata?: any
  // Campos específicos según el tipo
  productId?: number
  storeId?: number
  orderId?: number
  followedUserId?: number
}

export class SocialActivityService {
  /**
   * Crear una nueva actividad social
   */
  static async createActivity(data: CreateActivityData) {
    return await prisma.socialActivity.create({
      data: {
        user_id: data.userId,
        activity_type: data.activityType,
        entity_type: data.entityType,
        entity_id: data.entityId,
        title: data.title,
        description: data.description,
        is_public: data.isPublic ?? true,
        is_featured: data.isFeatured ?? false,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
        product_id: data.productId,
        store_id: data.storeId,
        order_id: data.orderId,
        /* followed_user_id: data.userId */ /* data.followedUserId  */
      }
    })
  }

  /**
   * Crear actividad de seguimiento a usuario
   */
  static async createFollowActivity(followerId: number, followedUserId: number, followedUsername: string) {
    return await this.createActivity({
      userId: followerId,
      activityType: 'USER_LOGIN' /* 'USER_FOLLOW' */,
      entityType: 'USER',
      entityId: followedUserId,
      title: `Comenzó a seguir a @${followedUsername}`,
      description: `Ahora sigue a @${followedUsername}`,
      isPublic: true,
      followedUserId: followedUserId
    })
  }

  /**
   * Crear actividad de like a producto
   */
  static async createProductLikeActivity(userId: number, productId: number, productName: string) {
    return await this.createActivity({
      userId,
      activityType: 'PRODUCT_LIKE',
      entityType: 'PRODUCT',
      entityId: productId,
      title: `Le gustó "${productName}"`,
      description: `Marcó como favorito el producto "${productName}"`,
      productId
    })
  }

  /**
   * Obtener actividades de un usuario con todas las relaciones
   */
  static async getUserActivities(
    userId: number,
    limit: number = 20,
    offset: number = 0,
    includePrivate: boolean = false
  ) {
    const whereClause: any = { user_id: userId }
    
    if (!includePrivate) {
      whereClause.is_public = true
    }

    const activities = await prisma.socialActivity.findMany({
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
    })

    const total = await prisma.socialActivity.count({
      where: whereClause
    })

    return { activities, total }
  }

  /**
   * Eliminar actividad de seguimiento cuando se deja de seguir
   */
  static async removeFollowActivity(followerId: number, /* followedUserId: number */) {
    return await prisma.socialActivity.deleteMany({
      where: {
        user_id: followerId,
        activity_type: 'USER_LOGIN', // 'USER_FOLLOW'
         /* followed_user_id: followerId */ /* followedUserId */
      }
    })
  }
}