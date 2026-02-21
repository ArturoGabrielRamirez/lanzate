'use server';

import type { ServerResponse } from '@/features/global/types';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { getProductReviewsData } from '@/features/products/data/get-product-reviews.data';
import type { PaginatedReviews } from '@/features/products/types/product.types';

/**
 * Server action to get product reviews
 * - Public action (no auth required)
 * - Supports pagination
 * - Returns approved reviews only
 * - Includes average rating
 */
export async function getProductReviewsAction(
  productId: string,
  page: number = 1,
  limit: number = 10
): Promise<ServerResponse<PaginatedReviews>> {
  return actionWrapper<PaginatedReviews>(async () => {
    const result = await getProductReviewsData(productId, page, limit);

    return formatSuccess('Reseñas obtenidas exitosamente', result);
  });
}
