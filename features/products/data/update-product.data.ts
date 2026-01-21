/**
 * Update Product Data Function
 *
 * Pure database operation to update an existing product.
 * Updates only the provided fields, leaving others unchanged.
 *
 * @param productId - Product ID to update
 * @param data - Product fields to update
 * @returns Updated product record
 *
 * @example
 * const product = await updateProductData('prod-123', {
 *   name: 'Updated Product Name',
 *   status: 'ACTIVE'
 * });
 */

import type { UpdateProductInput } from '@/features/products/types/product.types';
import { prisma } from '@/lib/prisma';

import type { Product } from '@prisma/client';

export async function updateProductData(
  productId: string,
  data: UpdateProductInput
): Promise<Product> {
  const product = await prisma.product.update({
    where: { id: productId },
    data,
  });

  return product;
}