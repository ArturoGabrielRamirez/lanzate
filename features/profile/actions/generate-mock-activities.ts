
/* import { findUserById } from '../data/find-user-by-id'
import { findUserComments } from '../data/find-user-comments'
import { findUserLikes } from '../data/find-user-like' */
// import { findUserFollows } from '../data/find-user-follows'
// import { findUserOrders } from '../data/find-user-orders'

/* export async function generateMockActivities(userId: number, limit: number) {
    try {
        const mockActivities = []

        // ===== LIKES =====
        const userLikes = await findUserLikes(userId, Math.floor(limit / 2))

        for (const like of userLikes) {
            mockActivities.push({
                id: `mock-like-${like.user_id}-${like.product_id}`,
                user_id: userId,
                activity_type: 'PRODUCT_LIKE',
                entity_type: 'PRODUCT',
                entity_id: like.product_id,
                title: `Le gustó "${like.products.name}"`,
                description: 'Le gustó este producto',
                is_public: true,
                is_featured: false,
                created_at: like.created_at,
                updated_at: like.created_at,
                product: like.products,
                store: null,
                order: null,
                metadata: null,
                store_id: null,
                employee_id: null,
                product_id: like.product_id,
                order_id: null
            })
        }

        // ===== COMENTARIOS =====
        const userComments = await findUserComments(userId, Math.floor(limit / 3))

        for (const comment of userComments) {
            mockActivities.push({
                id: `mock-comment-${comment.id}`,
                user_id: userId,
                activity_type: 'PRODUCT_COMMENT',
                entity_type: 'PRODUCT',
                entity_id: comment.product_id,
                title: `Comentó en "${comment.products.name}"`,
                description: comment.content.substring(0, 100) + (comment.content.length > 100 ? '...' : ''),
                is_public: true,
                is_featured: false,
                created_at: comment.created_at,
                updated_at: comment.updated_at,
                product: comment.products,
                store: null,
                order: null,
                metadata: null,
                store_id: null,
                employee_id: null,
                product_id: comment.product_id,
                order_id: null
            })
        }

        // ===== REGISTRO DE USUARIO =====
        const user = await findUserById(userId)

        if (user) {
            mockActivities.push({
                id: `mock-register-${userId}`,
                user_id: userId,
                activity_type: 'USER_REGISTERED',
                entity_type: 'USER',
                entity_id: userId,
                title: 'Se unió a la plataforma',
                description: `@${user.username} se registró en la plataforma`,
                is_public: true,
                is_featured: true,
                created_at: user.created_at,
                updated_at: user.created_at,
                product: null,
                store: null,
                order: null,
                metadata: null,
                store_id: null,
                employee_id: null,
                product_id: null,
                order_id: null
            })
        } */

        // TODO: Cuando agregues follows, descomenta este bloque
        /*
        // ===== FOLLOWS =====
        const userFollows = await findUserFollows(userId, Math.floor(limit / 4))
    
        for (const follow of userFollows) {
          mockActivities.push({
            id: `mock-follow-${follow.follower_id}-${follow.following_id}`,
            user_id: userId,
            activity_type: 'USER_FOLLOW',
            entity_type: 'USER',
            entity_id: follow.following_id,
            title: `Siguió a @${follow.following.username}`,
            description: `Comenzó a seguir a ${follow.following.first_name || follow.following.username}`,
            is_public: true,
            is_featured: false,
            created_at: follow.created_at,
            updated_at: follow.created_at,
            product: null,
            store: null,
            order: null,
            metadata: JSON.stringify({
              followedUser: {
                id: follow.following.id,
                username: follow.following.username,
                displayName: follow.following.first_name || follow.following.username,
                avatar: follow.following.avatar
              }
            }),
            store_id: null,
            employee_id: null,
            product_id: null,
            order_id: null
          })
        }
        */

        // TODO: Cuando agregues órdenes, descomenta este bloque
        /*
        // ===== ÓRDENES =====
        const userOrders = await findUserOrders(userId, Math.floor(limit / 5))
    
        for (const order of userOrders) {
          mockActivities.push({
            id: `mock-order-${order.id}`,
            user_id: userId,
            activity_type: 'ORDER_COMPLETED',
            entity_type: 'ORDER',
            entity_id: order.id,
            title: `Compró en ${order.store.name}`,
            description: `Orden completada por $${order.total_price}`,
            is_public: false,
            is_featured: false,
            created_at: order.created_at,
            updated_at: order.updated_at,
            product: null,
            store: order.store,
            order: {
              id: order.id,
              total_price: order.total_price,
              status: order.status
            },
            metadata: null,
            store_id: order.store_id,
            employee_id: null,
            product_id: null,
            order_id: order.id
          })
        }
        */

        // Ordenar por fecha más reciente
/*         return mockActivities.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
    } catch (error) {
        console.error('Error generating mock activities:', error)
        return []
    }
} */