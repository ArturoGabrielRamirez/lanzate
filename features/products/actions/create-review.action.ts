'use server';

import { revalidatePath } from 'next/cache';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { PRODUCT_ERROR_MESSAGES, PRODUCT_SUCCESS_MESSAGES } from '@/features/products/constants';
import { reviewSchema, type ReviewInput } from '@/features/products/schemas/product.schema';
import { createReviewService } from '@/features/products/services/create-review.service';
import { createClient } from '@/lib/supabase/server';

import type { ProductReview } from '@prisma/client';

/**
 * Create Review Server Action
 *
 * Creates a product review for an authenticated user.
 *
 * Flow:
 * 1. Authenticate user via Supabase
 * 2. Validate input with reviewSchema
 * 3. Call createReviewService to persist the review
 * 4. Revalidate product page
 * 5. Return the created review
 *
 * @param input - Review input (productId, orderItemId, rating, title, body?)
 * @returns ServerResponse with created review or error
 *
 * @example
 * ```tsx
 * const result = await createReviewAction({
 *   productId: 'prod-1',
 *   orderItemId: 'item-1',
 *   rating: 5,
 *   title: 'Great product!'
 * });
 * if (!result.hasError) {
 *   console.log('Review created:', result.payload.id);
 * }
 * ```
 */
export async function createReviewAction(input: ReviewInput) {
  return actionWrapper<ProductReview>(async () => {
    const supabase = await createClient();
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authUser) {
      throw new Error(PRODUCT_ERROR_MESSAGES.NOT_AUTHENTICATED);
    }

    await reviewSchema.validate(input, { abortEarly: false });

    const result = await createReviewService(input, authUser.id);

    revalidatePath('/[locale]/products/[slug]');

    return formatSuccess(PRODUCT_SUCCESS_MESSAGES.REVIEW_CREATED, result);
  });
}
