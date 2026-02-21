'use server';

import { revalidatePath } from 'next/cache';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { reviewSchema, type ReviewInput } from '@/features/products/schemas/product.schema';
import { createReviewService } from '@/features/products/services/create-review.service';
import { createClient } from '@/lib/supabase/server';

import type { ProductReview } from '@prisma/client';

/**
 * Server action to create review
 * - Authenticate user
 * - Validate with reviewSchema
 * - Call createReviewService
 * - Revalidate product page
 */
export async function createReviewAction(input: ReviewInput) {
  return actionWrapper<ProductReview>(async () => {
    // Authenticate user
    const supabase = await createClient();
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authUser) {
      throw new Error('Usuario no autenticado');
    }

    // Validate input manually with schema
    await reviewSchema.validate(input, { abortEarly: false });

    // Call service layer
    const result = await createReviewService(input, authUser.id);

    // Revalidate product pages to show new review count
    revalidatePath('/[locale]/products/[slug]');

    return formatSuccess('Reseña creada exitosamente', result);
  });
}
