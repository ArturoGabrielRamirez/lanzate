'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/features/auth/utils';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { PRODUCT_ERROR_MESSAGES, PRODUCT_SUCCESS_MESSAGES } from '@/features/products/constants';
import { deleteBundleSchema } from '@/features/products/schemas';
import { deleteBundleService } from '@/features/products/services/delete-bundle.service';

import type { ProductBundle } from '@prisma/client';

/**
 * Delete Bundle Server Action
 *
 * Deletes an existing product bundle.
 *
 * Flow:
 * 1. Authenticate user via Supabase
 * 2. Validate bundle ID with deleteBundleSchema
 * 3. Call deleteBundleService to remove the bundle
 * 4. Revalidate bundle pages
 * 5. Return the deleted bundle
 *
 * @param bundleId - The ID of the bundle to delete
 * @returns ServerResponse with deleted bundle or error
 *
 * @example
 * ```tsx
 * const result = await deleteBundleAction('bundle-id');
 * if (!result.hasError) {
 *   console.log('Bundle deleted:', result.payload.id);
 * }
 * ```
 */
export async function deleteBundleAction(bundleId: string) {
  return actionWrapper<ProductBundle>(async () => {
    const { authUser } = await requireAuth(PRODUCT_ERROR_MESSAGES.NOT_AUTHENTICATED);

    await deleteBundleSchema.validate({ id: bundleId }, { abortEarly: false });

    const result = await deleteBundleService(bundleId, authUser.id);

    revalidatePath('/[locale]/dashboard/[storeSlug]/bundles');

    return formatSuccess(PRODUCT_SUCCESS_MESSAGES.BUNDLE_DELETED, result);
  });
}
