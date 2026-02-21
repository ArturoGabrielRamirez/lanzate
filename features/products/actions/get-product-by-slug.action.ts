'use server';

import { notFound } from 'next/navigation';

import type { ServerResponse } from '@/features/global/types/action-wrapper.types';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { PRODUCT_SUCCESS_MESSAGES } from '@/features/products/constants';
import { getProductBySlugData } from '@/features/products/data';
import type { ProductWithAllRelations } from '@/features/products/types';
import { findStoreBySubdomainData } from '@/features/stores/data';

/**
 * Get Product By Slug Server Action
 *
 * Retrieves a product by slug for public display on the storefront.
 * Includes all necessary relations for the product detail page.
 * Only returns ACTIVE products for the public storefront.
 *
 * Flow:
 * 1. Validate store exists via findStoreBySubdomainData
 * 2. Call getProductBySlugData with store ID and slug
 * 3. Validate product exists (calls notFound() if not)
 * 4. Return product with all relations
 *
 * @param slug - Product slug (URL-friendly identifier)
 * @param subdomain - Store subdomain for store validation
 * @returns ServerResponse with product data or error
 *
 * @example
 * ```tsx
 * const result = await getProductBySlugAction('my-product', 'mystore');
 * if (!result.hasError && result.payload) {
 *   console.log('Product found:', result.payload.name);
 * }
 * ```
 */
export async function getProductBySlugAction(
  slug: string,
  subdomain: string
): Promise<ServerResponse<ProductWithAllRelations>> {
  return actionWrapper<ProductWithAllRelations>(async () => {
    const store = await findStoreBySubdomainData(subdomain);

    if (!store) {
      notFound();
    }

    const product = await getProductBySlugData(store.id, slug);

    if (!product) {
      notFound();
    }

    return formatSuccess(PRODUCT_SUCCESS_MESSAGES.FETCHED, product);
  });
}
