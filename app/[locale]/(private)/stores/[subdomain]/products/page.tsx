import { notFound } from 'next/navigation';

import { requireAuth } from '@/features/auth/utils';
import { getProductsAction } from '@/features/products/actions';
import { ProductListContainer } from '@/features/products/components/product-list-container';
import type { ProductListPageProps } from '@/features/products/types';
import { parseProductQueryParams } from '@/features/products/utils';
import { getOwnedStoreBySubdomainData } from '@/features/stores/data';

/**
 * Product List Page
 *
 * Server component that displays the product listing dashboard for a store.
 * Fetches products using getProductsAction with search params from URL.
 * Uses nuqs-compatible search params parsing.
 *
 * Route: /app/[locale]/(private)/stores/[subdomain]/products
 *
 * Search Params (synced via nuqs in client component):
 * - search: string (filter by product name/SKU)
 * - status: ProductStatus (filter by status)
 * - sort: string (sort field)
 * - page: number (current page)
 * - pageSize: number (items per page)
 */
export default async function ProductListPage({
  params,
  searchParams,
}: ProductListPageProps) {
  const { subdomain } = await params;
  const resolvedSearchParams = await searchParams;

  // Auth is handled by the parent layout, but we need dbUser for ownership verification
  const { dbUser } = await requireAuth();

  // Fetch store with ownership verification
  const store = await getOwnedStoreBySubdomainData(
    subdomain.toLowerCase(),
    dbUser.id
  );

  // Handle store not found or unauthorized
  if (!store) {
    notFound();
  }

  // Parse search params using centralized utility
  const { search, status, sortBy, page, pageSize } = parseProductQueryParams(resolvedSearchParams);

  // Fetch products with filters
  const productsResult = await getProductsAction({
    storeId: store.id,
    page,
    pageSize,
    search: search || undefined,
    status,
    sortBy,
    sortOrder: 'desc',
  });

  // Handle fetch error
  if (productsResult.hasError || !productsResult.payload) {
    return (
      <div className="bg-[#f8f5f2] px-2 dark:bg-background">
        <div className="container mx-auto py-8">
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-destructive">
              Error al cargar los productos. Por favor intenta nuevamente.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <ProductListContainer
        products={productsResult.payload.data}
        total={productsResult.payload.total}
        storeId={store.id}
        subdomain={subdomain}
      />
    </div>
  );
}
