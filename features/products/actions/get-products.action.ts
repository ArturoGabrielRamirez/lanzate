'use server';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
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
 * @param filters - Filter and pagination parameters
 * @returns ServerResponse with paginated products
 */
export async function getProductsAction(filters: GetProductsFilters) {
  return actionWrapper<PaginatedProducts>(async () => {
    const result = await getProductsData(filters);

    return formatSuccess('Productos obtenidos exitosamente', result);
  });
}
