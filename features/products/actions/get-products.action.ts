'use server';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { PRODUCT_SUCCESS_MESSAGES } from '@/features/products/constants';
import { getProductsData } from '@/features/products/data';
import type {
  GetProductsFilters,
  PaginatedProducts,
} from '@/features/products/types/product.types';

/**
 * Get Products Server Action
 *
 * Retrieves paginated products for a store with filtering and sorting.
 *
 * Flow:
 * 1. Call getProductsData with the provided filters
 * 2. Return paginated products with total count and pagination metadata
 *
 * @param filters - Filter and pagination parameters (storeId, page, pageSize, search, status, etc.)
 * @returns ServerResponse with paginated products
 *
 * @example
 * ```tsx
 * const result = await getProductsAction({
 *   storeId: 'store-id',
 *   page: 1,
 *   pageSize: 20,
 *   status: 'ACTIVE'
 * });
 * if (!result.hasError && result.payload) {
 *   console.log('Products:', result.payload.data);
 *   console.log('Total:', result.payload.total);
 * }
 * ```
 */
export async function getProductsAction(filters: GetProductsFilters) {
  return actionWrapper<PaginatedProducts>(async () => {
    const result = await getProductsData(filters);

    return formatSuccess(PRODUCT_SUCCESS_MESSAGES.FETCHED, result);
  });
}
