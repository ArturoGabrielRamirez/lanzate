'use server';

import { revalidatePath } from 'next/cache';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { PRODUCT_ERROR_MESSAGES, PRODUCT_SUCCESS_MESSAGES } from '@/features/products/constants';
import { updateBundleSchema } from '@/features/products/schemas';
import { updateBundleService } from '@/features/products/services';
import type { UpdateBundleInput } from '@/features/products/types';
import { createClient } from '@/lib/supabase/server';

import type { ProductBundle } from '@prisma/client';

/**
 * Update Bundle Server Action
 *
 * Updates an existing product bundle.
 *
 * Flow:
 * 1. Authenticate user via Supabase
 * 2. Validate input with updateBundleSchema
 * 3. Call updateBundleService to persist the changes
 * 4. Revalidate bundle pages
 * 5. Return the updated bundle
 *
 * @param input - Bundle update input (id, name, description, price, isActive, items)
 * @returns ServerResponse with updated bundle or error
 *
 * @example
 * ```tsx
 * const result = await updateBundleAction({
 *   id: 'bundle-id',
 *   name: 'Updated Bundle',
 *   price: 39.99,
 *   isActive: true,
 *   items: [{ productId: 'prod-1', quantity: 2 }]
 * });
 * if (!result.hasError) {
 *   console.log('Bundle updated:', result.payload.id);
 * }
 * ```
 */
export async function updateBundleAction(input: UpdateBundleInput) {
  return actionWrapper<ProductBundle>(async () => {
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

    await updateBundleSchema.validate(input, { abortEarly: false });

    const result = await updateBundleService(input, authUser.id);

    revalidatePath('/[locale]/dashboard/[storeSlug]/bundles');

    return formatSuccess(PRODUCT_SUCCESS_MESSAGES.BUNDLE_UPDATED, result);
  });
}
