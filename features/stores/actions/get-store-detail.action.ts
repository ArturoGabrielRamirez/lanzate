'use server';


import { getUserBySupabaseId } from '@/features/auth/data';
import { getAuthUser } from '@/features/auth/utils';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatError, formatSuccess } from '@/features/global/utils/format-response';
import {
  countStoreBranchesData,
  getOwnedStoreBySubdomainData,
  getStoreProductsPreviewData,
} from '@/features/stores/data';
import { prisma } from '@/lib/prisma';

import type { Product, ProductImage, ProductVariant, Store } from '@prisma/client';

/**
 * Product with images and variants for store detail page
 */
export type ProductWithRelations = Product & {
  images: ProductImage[];
  variants: ProductVariant[];
};

/**
 * Complete data for the store detail page
 */
export interface StoreDetailPageData {
  store: Store;
  products: ProductWithRelations[];
  productCount: number;
  branchCount: number;
}

/**
 * Get Store Detail Page Server Action
 *
 * Fetches all data needed for the store detail page:
 * - Store with ownership verification
 * - Products preview with images and variants
 * - Product count
 * - Branch count
 *
 * @param subdomain - The subdomain of the store to fetch
 * @returns ServerResponse with complete store detail page data
 */
export async function getStoreDetailAction(subdomain: string) {
  return actionWrapper<StoreDetailPageData | null>(async () => {
    // Validate subdomain is provided
    if (!subdomain || subdomain.trim() === '') {
      return formatError('Subdomain is required');
    }

    // Get authenticated user
    const authUser = await getAuthUser();

    if (!authUser) {
      return formatError('User not authenticated');
    }

    // Get database user
    const dbUser = await getUserBySupabaseId(authUser.id);

    // Fetch store with ownership verification
    const store = await getOwnedStoreBySubdomainData(
      subdomain.toLowerCase(),
      dbUser.id
    );

    if (!store) {
      return formatError('Store not found');
    }

    // Fetch all additional data in parallel
    const [products, productCount, branchCount] = await Promise.all([
      getStoreProductsPreviewData(store.id, 10),
      prisma.product.count({
        where: { storeId: store.id, status: 'ACTIVE' },
      }),
      countStoreBranchesData(store.id),
    ]);

    return formatSuccess('Store detail loaded', {
      store,
      products,
      productCount,
      branchCount,
    });
  });
}
