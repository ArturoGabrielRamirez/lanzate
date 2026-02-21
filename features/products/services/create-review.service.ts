import { Prisma } from '@prisma/client';

import { PRODUCT_ERROR_MESSAGES } from '@/features/products/constants/messages';
import { createReviewData } from '@/features/products/data/create-review.data';
import type { CreateReviewInput } from '@/features/products/types/product.types';
import { prisma } from '@/lib/prisma';

/** 
 * Business logic for review creation
 * - Validates user purchased product via order_item_id
 * - Prevents duplicate reviews (unique constraint)
 * - Validates order is completed
 * - Extracts orderId from orderItem
 */
export async function createReviewService(
  input: CreateReviewInput,
  userId: string
) {
  // Fetch order item to validate ownership and get order ID
  const orderItem = await prisma.orderItem.findUnique({
    where: { id: input.orderItemId },
    include: {
      order: true,
      product: true,
      variant: true,
    },
  });

  if (!orderItem) {
    throw new Error('Artículo de pedido no encontrado');
  }

  // Verify user owns the order
  if (orderItem.order.userId !== userId) {
    throw new Error(PRODUCT_ERROR_MESSAGES.REVIEW_PURCHASE_REQUIRED);
  }

  // Verify the order item matches the product being reviewed
  if (orderItem.productId !== input.productId) {
    throw new Error('El artículo de pedido no corresponde al producto');
  }

  try {
    // Create review with all required data
    return await createReviewData({
      productId: input.productId,
      userId,
      orderId: orderItem.orderId,
      orderItemId: input.orderItemId,
      rating: input.rating,
      title: input.title,
      body: input.body,
    });
  } catch (error) {
    // Handle unique constraint violation (duplicate review)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('Ya has creado una reseña para este producto');
      }
    }
    throw error;
  }
}
