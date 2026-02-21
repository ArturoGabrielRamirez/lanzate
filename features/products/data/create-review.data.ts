import type { CreateReviewDataInput } from '@/features/products/types';
import { prisma } from '@/lib/prisma';

/**
 * Pure Prisma query to create review
 * @param data - Review creation data with userId
 * @returns Created ProductReview
 */
export async function createReviewData(data: CreateReviewDataInput) {
  return await prisma.productReview.create({
    data: {
      productId: data.productId,
      userId: data.userId,
      orderId: data.orderId,
      orderItemId: data.orderItemId,
      rating: data.rating,
      title: data.title,
      body: data.body,
      status: 'PENDING', // Reviews start as pending
    },
    include: {
      product: true,
      user: true,
      order: true,
      orderItem: true,
    },
  });
}
