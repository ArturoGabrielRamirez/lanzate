import type { PaginatedReviews } from '@/features/products/types/product.types';
import { prisma } from '@/lib/prisma';

/**
 * Pure Prisma query to get paginated reviews
 * @param productId - Product ID
 * @param page - Page number (1-indexed)
 * @param limit - Items per page
 * @returns Paginated reviews with average rating
 */
export async function getProductReviewsData(
  productId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedReviews> {
  const skip = (page - 1) * limit;

  // Get approved reviews with user info
  const reviews = await prisma.productReview.findMany({
    where: {
      productId,
      status: 'APPROVED',
    },
    include: {
      user: {
        select: {
          username: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip,
    take: limit,
  });

  // Get total count
  const total = await prisma.productReview.count({
    where: {
      productId,
      status: 'APPROVED',
    },
  });

  // Calculate average rating
  const aggregate = await prisma.productReview.aggregate({
    where: {
      productId,
      status: 'APPROVED',
    },
    _avg: {
      rating: true,
    },
  });

  return {
    reviews,
    total,
    averageRating: aggregate._avg.rating ?? 0,
    page,
    limit,
  };
}
