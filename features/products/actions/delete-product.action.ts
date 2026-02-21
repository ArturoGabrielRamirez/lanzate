'use server';

import { revalidatePath } from 'next/cache';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { PRODUCT_SUCCESS_MESSAGES } from '@/features/products/constants';
import { deleteProductService } from '@/features/products/services';

/**
 * Delete Product Server Action
 *
 * Deletes a product and all related data (cascade delete).
 *
 * Flow:
 * 1. Call deleteProductService with productId and storeId for ownership validation
 * 2. Revalidate product list path
 * 3. Return success response
 *
 * @param productId - The product ID to delete
 * @param storeId - The store ID (for ownership validation)
 * @returns ServerResponse with success message or error
 *
 * @example
 * ```tsx
 * const result = await deleteProductAction('prod-id', 'store-id');
 * if (!result.hasError) {
 *   console.log('Product deleted successfully');
 * }
 * ```
 */
export async function deleteProductAction(productId: string, storeId: string) {
  return actionWrapper<{ deleted: boolean }>(async () => {
    await deleteProductService(productId, storeId);

    revalidatePath('/[locale]/dashboard/[storeSlug]/products');

    return formatSuccess(PRODUCT_SUCCESS_MESSAGES.DELETE, { deleted: true });
  });
}
