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
import { createProductService } from '@/features/products/services';
import type {
  CreateFullProductInput,
  ProductWithAllRelations,
} from '@/features/products/types/product.types';
import { createClient } from '@/lib/supabase/server';

/**
 * Create Product Server Action
 *
 * Creates a new product with all related data (variants, images, attributes, etc.)
 *
 * Flow:
 * 1. Authenticate user via Supabase
 * 2. Fetch database user record by Supabase ID
 * 3. Validate input data with Yup schemas (basicInfo, media, variants)
 * 4. Call createProductService (enforces attribute limits per subscription tier)
 * 5. Revalidate product list path
 * 6. Return created product
 *
 * @param input - Full product creation input
 * @returns ServerResponse with created product or error
 *
 * @example
 * ```tsx
 * const result = await createProductAction({
 *   basicInfo: { name: 'My Product', slug: 'my-product', price: 9.99 },
 *   storeId: 'store-id'
 * });
 * if (!result.hasError) {
 *   console.log('Created:', result.payload.id);
 * }
 * ```
 */
export async function createProductAction(input: CreateFullProductInput) {
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

    await productBasicInfoSchema.validate(input.basicInfo, { abortEarly: false });

    if (input.images && input.images.length > 0) {
      await productMediaSchema.validate({ images: input.images }, { abortEarly: false });
    }

    if (input.variants && input.variants.length > 0) {
      for (const variant of input.variants) {
        await productVariantSchema.validate(variant, { abortEarly: false });
      }
    }

    const product = await createProductService(input, dbUser.id);

    revalidatePath('/[locale]/dashboard/[storeSlug]/products');

    return formatSuccess(PRODUCT_SUCCESS_MESSAGES.CREATE, product);
  });
}
