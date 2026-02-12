/**
 * Product Listing Page
 *
 * Server component for displaying product listing/grid.
 * Uses ISR for performance with 1-hour revalidation.
 * Supports search, sorting, and pagination.
 *
 * Features:
 * - Search functionality
 * - Sort options (newest, price)
 * - Responsive grid layout
 * - Pagination with URL state
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getProductsAction } from '@/features/products/actions';
import { findStoreBySubdomainData } from '@/features/stores/data';
import { ProductGrid } from '@/features/products/components/product-grid';
import { ProductFilters } from '@/features/products/components/product-filters';
import { Suspense } from 'react';
import type { ProductListingPageProps, ProductListingFilters } from '@/features/products/types/product-listing.types';

/**
 * Generate SEO metadata for product listing page
 */
export async function generateMetadata({
  params,
}: ProductListingPageProps): Promise<Metadata> {
  const { subdomain } = await params;
  
  // Get store info for metadata
  const store = await findStoreBySubdomainData(subdomain);
  
  if (!store) {
    return {
      title: 'Tienda no encontrada',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `Productos - ${store.name}`,
    description: `Explora nuestro catálogo de productos en ${store.name}`,
    openGraph: {
      title: `Productos - ${store.name}`,
      description: `Explora nuestro catálogo de productos en ${store.name}`,
      type: 'website',
      url: `https://${subdomain}.lanzate.app/s/${subdomain}/products`,
      siteName: store.name,
    },
    twitter: {
      card: 'summary',
      title: `Productos - ${store.name}`,
      description: `Explora nuestro catálogo de productos en ${store.name}`,
    },
    alternates: {
      canonical: `/s/${subdomain}/products`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Loading skeleton for product listing page
 */
function ProductListingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filters */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="h-10 w-full md:w-64 animate-pulse rounded bg-muted" />
        <div className="h-10 w-32 animate-pulse rounded bg-muted" />
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-square w-full animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-10 w-full animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Product listing content component
 */
async function ProductListingContent({ 
  subdomain, 
  searchParams 
}: { 
  subdomain: string; 
  searchParams: ProductListingFilters; 
}) {
  // Prepare filters for API call
  const sortBy = searchParams.sort === 'updatedAt-desc' ? 'updatedAt' :
                searchParams.sort === 'createdAt-desc' ? 'createdAt' :
                searchParams.sort === 'price-desc' ? 'price' :
                searchParams.sort === 'name-desc' ? 'name' :
                searchParams.sort === 'updatedAt-asc' ? 'updatedAt' :
                searchParams.sort === 'createdAt-asc' ? 'createdAt' :
                searchParams.sort === 'price-asc' ? 'price' :
                searchParams.sort === 'name-asc' ? 'name' : 'updatedAt';

  const sortOrder = searchParams.sort === 'updatedAt-asc' || searchParams.sort === 'createdAt-asc' || 
                  searchParams.sort === 'price-asc' || searchParams.sort === 'name-asc' ? 'asc' : 'desc';

  const filters: ProductListingFilters = {
    storeId: '', // Will be populated from store data
    ...searchParams,
    status: 'ACTIVE', // Only show active products
    page: searchParams.page ? parseInt(searchParams.page, 10) : 1,
    pageSize: 12,
    sortBy,
    sortOrder,
  };

  // Get store ID
  const store = await findStoreBySubdomainData(subdomain);
  if (!store) {
    notFound();
  }
  
  filters.storeId = store.id;

  // Fetch products
  const productsResult = await getProductsAction(filters);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Todos los productos
        </h1>
        <p className="text-muted-foreground">
          Explora nuestro catálogo completo de productos
        </p>
      </div>

      {/* Search and Filters */}
      <Suspense fallback={<ProductListingSkeleton />}>
        <ProductFilters
          search={searchParams.search || ''}
          sort={`${searchParams.sortBy || 'updatedAt'}-${searchParams.sortOrder || 'desc'}`}
          onSearchChange={(value) => {
            // TODO: Implement search URL update
          }}
          onSortChange={(value) => {
            // TODO: Implement sort URL update
          }}
        />
      </Suspense>

      {/* Products Grid */}
      <div className="mt-8">
        {productsResult.hasError || !productsResult.payload ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No se pudieron cargar los productos. Por favor, intenta nuevamente.
            </p>
          </div>
        ) : (
          <Suspense fallback={<ProductListingSkeleton />}>
            <ProductGrid
              products={productsResult.payload.data || []}
              storeSubdomain={subdomain}
              emptyMessage="No se encontraron productos con los filtros seleccionados."
            />
          </Suspense>
        )}
      </div>

      {/* TODO: Pagination */}
      {productsResult.payload && productsResult.payload.totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <div className="text-sm text-muted-foreground">
            Página {filters.page} de {productsResult.payload.totalPages}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Product listing page with ISR
 */
export default async function ProductListingPage({
  params,
  searchParams,
}: ProductListingPageProps) {
  const { subdomain } = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <ProductListingContent 
      subdomain={subdomain}
      searchParams={{
        search: resolvedSearchParams.search,
        page: resolvedSearchParams.page,
        sortBy: resolvedSearchParams.sort,
        sortOrder: resolvedSearchParams.order,
      }}
    />
  );
}

/**
 * Enable ISR for product listing pages
 * Revalidate every hour to keep product list fresh
 */
export const revalidate = 3600; // 1 hour in seconds