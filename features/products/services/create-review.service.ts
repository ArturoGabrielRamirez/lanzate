import { Prisma } from '@prisma/client';

import { PRODUCT_ERROR_MESSAGES } from '@/features/products/constants/messages';
import { createReviewData, getOrderItemWithOrderData } from '@/features/products/data';
import type { CreateReviewInput } from '@/features/products/types/product.types';

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
  // Fetch order item to validate ownership and get order ID via data layer
  const orderItem = await getOrderItemWithOrderData(input.orderItemId);

  if (!orderItem) {
    throw new Error(PRODUCT_ERROR_MESSAGES.ORDER_ITEM_NOT_FOUND);
  }

  // Verify user owns the order
  if (orderItem.order.userId !== userId) {
    throw new Error(PRODUCT_ERROR_MESSAGES.REVIEW_PURCHASE_REQUIRED);
  }

  // Verify the order item matches the product being reviewed
  if (orderItem.productId !== input.productId) {
    throw new Error(PRODUCT_ERROR_MESSAGES.ORDER_ITEM_MISMATCH);
  }

  try {
    // Create review with all required data via data layer
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
        throw new Error(PRODUCT_ERROR_MESSAGES.REVIEW_ALREADY_EXISTS);
      }
    }
    throw error;
  }
}
