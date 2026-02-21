'use server';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { PRODUCT_ERROR_MESSAGES, PRODUCT_SUCCESS_MESSAGES } from '@/features/products/constants';
import { getProductByIdData } from '@/features/products/data';
import type { ProductWithAllRelations } from '@/features/products/types/product.types';

/**
 * Get Product By ID Server Action
 *
 * Retrieves a single product with all relations by its ID.
 *
 * Flow:
 * 1. Call getProductByIdData to fetch product from database
 * 2. Validate product exists
 * 3. Return product with all relations
 *
 * @param productId - The product ID to retrieve
 * @returns ServerResponse with product or error if not found
 *
 * @example
 * ```tsx
 * const result = await getProductByIdAction('prod-id');
 * if (!result.hasError && result.payload) {
 *   console.log('Product:', result.payload.name);
 * }
 * ```
 */
export async function getProductByIdAction(productId: string) {
  return actionWrapper<ProductWithAllRelations>(async () => {
    const product = await getProductByIdData(productId);

    if (!product) {
      throw new Error(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    }

    return formatSuccess(PRODUCT_SUCCESS_MESSAGES.FETCHED, product);
  });
}
