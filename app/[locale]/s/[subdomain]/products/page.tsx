/**
 * Storefront Product Listing Page
 *
 * Public product catalog for a store accessed via subdomain.
 * Reads search/sort/page from URL searchParams (set by nuqs client container),
 * fetches products on the server, and passes data to the client container.
 * The shell (header + footer + CSS theme) is provided by layout.tsx.
 *
 * Route: /[locale]/s/[subdomain]/products
 * Accessed as: mystore.localhost:3000/products (proxy rewrites)
 *
 * Architecture:
 * - Server Component: reads searchParams, fetches, renders
 * - StorefrontProductListContainer: "use client" nuqs state management
 * - No prop-drilling of callbacks — server re-fetches on URL change
 * - ISR with 1-hour revalidation
 */

import { notFound } from 'next/navigation';

import { getProductsAction } from '@/features/products/actions';
import { StorefrontProductListContainer } from '@/features/storefront/components';
import { STOREFRONT_PAGE_SIZE } from '@/features/storefront/config';
import { type ProductListingPageProps } from '@/features/storefront/types/storefront.types';
import { mapProductsToStorefront } from '@/features/storefront/utils';
import { getStorePublicDataAction } from '@/features/stores/actions';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: ProductListingPageProps): Promise<Metadata> {
  const { subdomain } = await params;
  const result = await getStorePublicDataAction(subdomain);

  if (result.hasError || !result.payload) {
    return { title: 'Tienda no encontrada', robots: { index: false, follow: false } };
  }

  const { store } = result.payload;

  return {
    title: `Productos — ${store.name}`,
    description: `Explora el catálogo completo de ${store.name}`,
    openGraph: {
      title: `Productos — ${store.name}`,
      description: `Explora el catálogo completo de ${store.name}`,
      type: 'website',
    },
    robots: { index: true, follow: true },
  };
}

export default async function StorefrontProductsPage({
  params,
  searchParams,
}: ProductListingPageProps) {
  const { subdomain } = await params;
  const { search, sort, page } = await searchParams;

  const storeResult = await getStorePublicDataAction(subdomain);

  if (storeResult.hasError || !storeResult.payload) {
    notFound();
  }

  const { store } = storeResult.payload;

  // Parse sort into sortBy + sortOrder
  const sortParts = sort?.split('-') ?? [];
  const sortBy = (sortParts[0] as 'name' | 'createdAt' | 'updatedAt') ?? 'createdAt';
  const sortOrder = (sortParts[1] as 'asc' | 'desc') ?? 'desc';
  const currentPage = page ? Math.max(1, parseInt(page, 10)) : 1;

  // Fetch paginated products
  const productsResult = await getProductsAction({
    storeId: store.id,
    status: 'ACTIVE',
    search: search ?? undefined,
    sortBy,
    sortOrder,
    page: currentPage,
    pageSize: STOREFRONT_PAGE_SIZE,
  });

  const products = productsResult.payload?.data ?? [];
  const totalPages = productsResult.payload?.totalPages ?? 1;
  const totalCount = productsResult.payload?.total ?? 0;

  return (
    <main className="flex-1 container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ color: 'var(--sf-text)' }}
        >
          Todos los productos
        </h1>
        <p
          className="mt-1 text-base"
          style={{ color: 'color-mix(in srgb, var(--sf-text) 65%, transparent)' }}
        >
          {store.name}
        </p>
      </div>

      {/* Client container handles search/sort/pagination via nuqs */}
      <StorefrontProductListContainer
        initialProducts={mapProductsToStorefront(products)}
        totalPages={totalPages}
        totalCount={totalCount}
        storeSubdomain={subdomain}
        initialSearch={search ?? ''}
        initialSort={sort ?? 'createdAt-desc'}
        initialPage={currentPage}
      />
    </main>
  );
}

export const revalidate = 3600; // ISR: revalidate every hour
