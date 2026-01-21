/**
 * Get Products Data Function
 *
 * Pure database operation to retrieve paginated products for a store.
 * Supports filtering by status, search (including SKU), and various product flags.
 * Returns paginated result with metadata.
 *
 * @param filters - Filtering and pagination parameters
 * @returns Paginated products with metadata
 *
 * @example
 * const result = await getProductsData({
 *   storeId: 'store-123',
 *   page: 1,
 *   pageSize: 10,
 *   search: 'laptop',
 *   status: 'ACTIVE',
 *   sortBy: 'createdAt',
 *   sortOrder: 'desc'
 * });
 */

import type { GetProductsFilters, PaginatedProducts } from '@/features/products/types/product.types';
import { prisma } from '@/lib/prisma';

import type { Prisma } from '@prisma/client';

export async function getProductsData(
  filters: GetProductsFilters
): Promise<PaginatedProducts> {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 10;
  const skip = (page - 1) * pageSize;
  const sortBy = filters.sortBy ?? 'createdAt';
  const sortOrder = filters.sortOrder ?? 'desc';

  // Build where clause
  const where: Prisma.ProductWhereInput = {
    storeId: filters.storeId,
  };

  // Add optional filters
  if (filters.status) where.status = filters.status;
  if (filters.isDigital !== undefined) where.isDigital = filters.isDigital;
  if (filters.isFeatured !== undefined) where.isFeatured = filters.isFeatured;
  if (filters.isNew !== undefined) where.isNew = filters.isNew;
  if (filters.isOnSale !== undefined) where.isOnSale = filters.isOnSale;

  // Add search filter (search in name, description, slug, and variant SKUs)
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
      { slug: { contains: filters.search, mode: 'insensitive' } },
      { variants: { some: { sku: { contains: filters.search, mode: 'insensitive' } } } },
    ];
  }

  // Build orderBy clause
  const orderBy: Prisma.ProductOrderByWithRelationInput = {
    [sortBy]: sortOrder,
  };

  // Execute count and findMany in parallel
  const [total, data] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      skip,
      take: pageSize,
      orderBy,
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages,
  };
}
