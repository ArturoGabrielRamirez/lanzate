'use server';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { getProductByIdData } from '@/features/products/data';
import type { ProductWithAllRelations } from '@/features/products/types/product.types';

/**
 * Get Product By ID Server Action
 *
 * Retrieves a single product with all relations by its ID.
 *
 * @param productId - The product ID to retrieve
 * @returns ServerResponse with product or error if not found
 */
export async function getProductByIdAction(productId: string) {
  return actionWrapper<ProductWithAllRelations>(async () => {
    const product = await getProductByIdData(productId);

    if (!product) {
      throw new Error('Producto no encontrado');
    }

    return formatSuccess('Producto obtenido exitosamente', product);
  });
}
