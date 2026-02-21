import { notFound, redirect } from 'next/navigation';

import { getUserBySupabaseId } from '@/features/auth/data';
import { getAuthUser } from '@/features/auth/utils';
import { getProductsAction } from '@/features/products/actions';
import { ProductListContainer } from '@/features/products/components/product-list-container';
import type { ProductListPageProps, ProductStatus } from '@/features/products/types';
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

  // Check authentication status
  const user = await getAuthUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login');
  }

  // Get database user
  const dbUser = await getUserBySupabaseId(user.id);

  // Fetch store with ownership verification
  const store = await getOwnedStoreBySubdomainData(
    subdomain.toLowerCase(),
    dbUser.id
  );

  // Handle store not found or unauthorized
  if (!store) {
    notFound();
  }

  // Parse search params
  const search = typeof resolvedSearchParams.search === 'string'
    ? resolvedSearchParams.search
    : '';

  const statusParam = typeof resolvedSearchParams.status === 'string'
    ? resolvedSearchParams.status
    : '';

  const status = statusParam && ['ACTIVE', 'DRAFT', 'ARCHIVED'].includes(statusParam)
    ? (statusParam as ProductStatus)
    : undefined;

  const sortParam = typeof resolvedSearchParams.sort === 'string'
    ? resolvedSearchParams.sort
    : 'createdAt';

  const sortBy = ['name', 'createdAt', 'updatedAt'].includes(sortParam)
    ? (sortParam as 'name' | 'createdAt' | 'updatedAt')
    : 'createdAt';

  const page = typeof resolvedSearchParams.page === 'string'
    ? parseInt(resolvedSearchParams.page, 10)
    : 1;

  const pageSize = typeof resolvedSearchParams.pageSize === 'string'
    ? parseInt(resolvedSearchParams.pageSize, 10)
    : 10;

  // Fetch products with filters
  const productsResult = await getProductsAction({
    storeId: store.id,
    page: !isNaN(page) && page > 0 ? page : 1,
    pageSize: !isNaN(pageSize) && pageSize > 0 ? pageSize : 10,
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
