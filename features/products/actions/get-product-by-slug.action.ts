"use server";
/**
 * Get Product By Slug Action
 *
 * Server action to retrieve a product by slug for public display.
 * Includes all necessary relations for product detail page.
 * Only returns ACTIVE products for public storefront.
 *
 * Architecture:
 * - Uses actionWrapper for consistent error handling
 * - Calls data layer function
 * - Returns ServerResponse with ProductWithAllRelations
 */

import { notFound } from 'next/navigation';

import type { ServerResponse } from '@/features/global/types/action-wrapper.types';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { getProductBySlugData } from '@/features/products/data';
import type { ProductWithAllRelations } from '@/features/products/types';
import { findStoreBySubdomainData } from '@/features/stores/data';

/**
 * Get a product by slug for public display
 *
 * @param slug - Product slug (URL-friendly identifier)
 * @param subdomain - Store subdomain for validation
 * @returns ServerResponse with product data or error
 *
 * @example
 * const result = await getProductBySlugAction('my-product', 'mystore');
 * if (result.success && result.payload) {
 *   console.log('Product found:', result.payload.name);
 * }
 */
export async function getProductBySlugAction(
  slug: string,
  subdomain: string
): Promise<ServerResponse<ProductWithAllRelations>> {
  return actionWrapper<ProductWithAllRelations>(async () => {
    // First, validate store exists
    const store = await findStoreBySubdomainData(subdomain);
    
    if (!store) {
      notFound();
    }

    // Get product with all relations
    const product = await getProductBySlugData(store.id, slug);

    if (!product) {
      notFound();
    }

    return formatSuccess('Producto encontrado', product);
  });
}