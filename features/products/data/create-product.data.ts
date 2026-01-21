/**
 * Create Product Data Function
 *
 * Pure database operation to insert a new product record.
 * Does NOT contain business logic - only database interaction.
 *
 * @param input - Product creation input with basic info
 * @param storeId - Store ID to associate product with
 * @returns The created product record
 *
 * @example
 * const product = await createProductData({
 *   basicInfo: { name: 'Product', slug: 'product', status: 'DRAFT' },
 *   storeId: 'store-123'
 * });
 */

import type { CreateProductInput } from '@/features/products/types/product.types';
import { prisma } from '@/lib/prisma';

import type { Product } from '@prisma/client';

export async function createProductData(
  input: CreateProductInput
): Promise<Product> {
  const product = await prisma.product.create({
    data: {
      ...input.basicInfo,
      storeId: input.storeId,
    },
  });

  return product;
}