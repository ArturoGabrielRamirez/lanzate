import { notFound, redirect } from 'next/navigation';

import { getUserBySupabaseId } from '@/features/auth/data';
import { getAuthUser } from '@/features/auth/utils';
import { getProductsAction } from '@/features/products/actions';
import { ProductDataTable } from '@/features/products/components/product-data-table';
import type { ProductListPageProps } from '@/features/products/types/product.types';
import { getOwnedStoreBySubdomainData } from '@/features/stores/data';

/**
 * Product List Page
 *
 * Server component that displays the product listing dashboard for a store.
 * Fetches products using getProductsAction and passes data to DataTable component.
 *
 * Route: /app/[locale]/(private)/stores/[subdomain]/products
 */
export default async function ProductListPage({ params }: ProductListPageProps) {
  const { subdomain } = await params;

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

  // Fetch initial products for the store
  const productsResult = await getProductsAction({
    storeId: store.id,
    page: 1,
    pageSize: 10,
    sortBy: 'createdAt',
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
      <ProductDataTable
        initialData={productsResult.payload.data}
        totalItems={productsResult.payload.total}
        storeId={store.id}
      />
    </div>
  );
}
