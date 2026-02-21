'use server';

import { revalidatePath } from 'next/cache';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { PRODUCT_ERROR_MESSAGES, PRODUCT_SUCCESS_MESSAGES } from '@/features/products/constants';
import { bundleSchema } from '@/features/products/schemas/product.schema';
import { createBundleService } from '@/features/products/services/create-bundle.service';
import type { CreateBundleInput } from '@/features/products/types/product.types';
import { createClient } from '@/lib/supabase/server';

import type { ProductBundle } from '@prisma/client';

/**
 * Create Bundle Server Action
 *
 * Creates a new product bundle for a store.
 *
 * Flow:
 * 1. Authenticate user via Supabase
 * 2. Validate input with bundleSchema
 * 3. Call createBundleService to persist the bundle
 * 4. Revalidate bundle pages
 * 5. Return the created bundle
 *
 * @param input - Bundle creation input (name, description, price, items)
 * @returns ServerResponse with created bundle or error
 *
 * @example
 * ```tsx
 * const result = await createBundleAction({
 *   name: 'Starter Pack',
 *   price: 29.99,
 *   isActive: true,
 *   items: [{ productId: 'prod-1', quantity: 1 }]
 * });
 * if (!result.hasError) {
 *   console.log('Bundle created:', result.payload.id);
 * }
 * ```
 */
export async function createBundleAction(input: CreateBundleInput) {
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

    await bundleSchema.validate(input, { abortEarly: false });

    const result = await createBundleService(input, authUser.id);

    revalidatePath('/[locale]/dashboard/[storeSlug]/bundles');

    return formatSuccess(PRODUCT_SUCCESS_MESSAGES.BUNDLE_CREATED, result);
  });
}
