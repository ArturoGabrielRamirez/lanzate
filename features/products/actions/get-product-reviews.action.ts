'use server';

import type { ServerResponse } from '@/features/global/types';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { PRODUCT_SUCCESS_MESSAGES } from '@/features/products/constants';
import { getProductReviewsData } from '@/features/products/data/get-product-reviews.data';
import type { PaginatedReviews } from '@/features/products/types/product.types';

/**
 * Get Product Reviews Server Action
 *
 * Retrieves paginated reviews for a product.
 * This is a public action — no authentication required.
 * Returns only approved reviews with average rating.
 *
 * Flow:
 * 1. Call getProductReviewsData with productId, page, and limit
 * 2. Return paginated reviews with average rating
 *
 * @param productId - The product ID to fetch reviews for
 * @param page - Page number (defaults to 1)
 * @param limit - Number of reviews per page (defaults to 10)
 * @returns ServerResponse with paginated reviews data
 *
 * @example
 * ```tsx
 * const result = await getProductReviewsAction('prod-id', 1, 10);
 * if (!result.hasError && result.payload) {
 *   console.log('Reviews:', result.payload.reviews);
 *   console.log('Average rating:', result.payload.averageRating);
 * }
 * ```
 */
export async function getProductReviewsAction(
  productId: string,
  page: number = 1,
  limit: number = 10
): Promise<ServerResponse<PaginatedReviews>> {
  return actionWrapper<PaginatedReviews>(async () => {
    const result = await getProductReviewsData(productId, page, limit);

    return formatSuccess(PRODUCT_SUCCESS_MESSAGES.REVIEWS_FETCHED, result);
  });
}
