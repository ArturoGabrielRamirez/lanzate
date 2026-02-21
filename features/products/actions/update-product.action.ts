'use server';

import { revalidatePath } from 'next/cache';

import { getUserBySupabaseId } from '@/features/auth/data';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { PRODUCT_ERROR_MESSAGES, PRODUCT_SUCCESS_MESSAGES } from '@/features/products/constants';
import {
  productBasicInfoSchema,
  productMediaSchema,
  productVariantSchema,
} from '@/features/products/schemas';
import { updateProductService } from '@/features/products/services';
import type {
  UpdateFullProductInput,
  ProductWithAllRelations,
} from '@/features/products/types/product.types';
import { createClient } from '@/lib/supabase/server';

/**
 * Update Product Server Action
 *
 * Updates an existing product with all related data.
 *
 * Flow:
 * 1. Authenticate user via Supabase
 * 2. Fetch database user record by Supabase ID
 * 3. Validate input data with Yup schemas (basicInfo, media, variants)
 * 4. Call updateProductService to persist changes
 * 5. Revalidate product list and detail paths
 * 6. Return updated product
 *
 * @param productId - The product ID to update
 * @param input - Product update input (basicInfo?, attributes?, variants?, images?, etc.)
 * @returns ServerResponse with updated product or error
 *
 * @example
 * ```tsx
 * const result = await updateProductAction('prod-id', {
 *   basicInfo: { name: 'Updated Name', price: 19.99 }
 * });
 * if (!result.hasError) {
 *   console.log('Updated:', result.payload.name);
 * }
 * ```
 */
export async function updateProductAction(
  productId: string,
  input: UpdateFullProductInput
) {
  return actionWrapper<ProductWithAllRelations>(async () => {
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

    const dbUser = await getUserBySupabaseId(authUser.id);

    if (input.basicInfo) {
      const partialSchema = productBasicInfoSchema.partial();
      await partialSchema.validate(input.basicInfo, { abortEarly: false });
    }

    if (input.images && input.images.length > 0) {
      await productMediaSchema.validate({ images: input.images }, { abortEarly: false });
    }

    if (input.variants && input.variants.length > 0) {
      for (const variant of input.variants) {
        await productVariantSchema.validate(variant, { abortEarly: false });
      }
    }

    const product = await updateProductService(productId, input, dbUser.id);

    revalidatePath('/[locale]/dashboard/[storeSlug]/products');
    revalidatePath(`/[locale]/dashboard/[storeSlug]/products/${productId}`);

    return formatSuccess(PRODUCT_SUCCESS_MESSAGES.UPDATE, product);
  });
}
