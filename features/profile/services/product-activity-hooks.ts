// services/product-activity-hooks.ts
/* import { prisma } from "@/utils/prisma"
import { SocialActivityService } from "./social-activity-services" */


/**
 * Hook que se ejecuta cuando un usuario le da like a un producto
 * Debe llamarse desde la acción de like
 */
/* export async function onProductLike(userId: number, productId: number) {
  // Obtener información del producto
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      name: true,
      store_id: true
    }
  })

  if (!product) return

  // Crear actividad social
  await SocialActivityService.createActivity({
    userId,
    activityType: 'PRODUCT_LIKE',
    entityType: 'PRODUCT',
    entityId: productId,
    title: `Le gustó "${product.name}"`,
    description: `Marcó como favorito el producto "${product.name}"`,
    productId,
    storeId: product.store_id
  })
} */

/**
 * Hook que se ejecuta cuando un usuario quita el like a un producto
 */
/* export async function onProductUnlike(userId: number, productId: number) {
  // Eliminar la actividad de like
  await prisma.socialActivity.deleteMany({
    where: {
      user_id: userId,
      activity_type: 'PRODUCT_LIKE',
      product_id: productId
    }
  })
} */

/**
 * Hook para cuando se crea un comentario
 */
/* export async function onProductComment(userId: number, productId: number, comment: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      name: true,
      store_id: true
    }
  })

  if (!product) return

  await SocialActivityService.createActivity({
    userId,
    activityType: 'PRODUCT_COMMENT',
    entityType: 'PRODUCT',
    entityId: productId,
    title: `Comentó en "${product.name}"`,
    description: comment.length > 100 ? `${comment.substring(0, 100)}...` : comment,
    productId,
    storeId: product.store_id
  })
} */