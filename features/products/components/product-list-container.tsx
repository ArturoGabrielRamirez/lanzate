"use client"

import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useState, useTransition } from 'react';

import { ProductCardRow } from '@/features/products/components/product-card-row';
import { ProductFilters } from '@/features/products/components/product-filters';
import { PRODUCT_UI_MESSAGES } from '@/features/products/constants';
import type { ProductListContainerProps } from '@/features/products/types';
import { cn } from '@/features/shadcn/utils/cn';

/**
 * ProductListContainer Component
 *
 * Client component that displays products using BaseCard in row layout.
 * Uses nuqs for URL state management to sync search params with URL.
 */
export function ProductListContainer({
  products,
  total: _total,
  storeId: _storeId,
  subdomain,
}: ProductListContainerProps) {
  // Bulk selection state
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  // nuqs search params state management
  const [searchParams, setSearchParams] = useQueryStates({
    search: parseAsString.withDefault(''),
    status: parseAsString.withDefault(''),
    sort: parseAsString.withDefault('createdAt'),
    page: parseAsInteger.withDefault(1),
    pageSize: parseAsInteger.withDefault(10),
  }, { shallow: false });

  // Handlers for filter/search changes
  const handleSearchChange = (search: string) => {
    startTransition(() => {
      setSearchParams({ search, page: 1 });
    });
  };

  const handleStatusChange = (status: string) => {
    startTransition(() => {
      setSearchParams({ status, page: 1 });
    });
  };

  const handleSortChange = (sort: string) => {
    startTransition(() => {
      setSearchParams({ sort });
    });
  };

  const handleClearFilters = () => {
    startTransition(() => {
      setSearchParams({
        search: '',
        status: '',
        sort: 'createdAt',
        page: 1,
      });
    });
  };

  // Toggle individual product selection
  const handleToggleSelect = (productId: string) => {
    setSelectedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Search and Filters UI */}
      <ProductFilters
        search={searchParams.search}
        sort={searchParams.sort}
        status={searchParams.status}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onStatusChange={handleStatusChange}
        onClearFilters={handleClearFilters}
        isPending={isPending}
      />

      <div className={cn(
        "flex w-full flex-col gap-1.5 transition-opacity duration-200",
        isPending && "opacity-60 pointer-events-none"
      )}>
        {/* Empty state */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/10 p-12">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-muted-foreground"
              >
                <path d="M3 3h18v18H3zM21 9H3M21 15H3M12 3v18" />
              </svg>
            </div>
            <h3 className="mb-1 text-lg font-semibold">
              {PRODUCT_UI_MESSAGES.NO_PRODUCTS.es}
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchParams.search || searchParams.status
                ? "No se encontraron productos con los filtros aplicados"
                : PRODUCT_UI_MESSAGES.NO_PRODUCTS_DESCRIPTION.es}
            </p>
          </div>
        ) : (
          <>
            {/* Header row with column labels */}


            {/* Product rows */}
            {products.map((product) => (
              <ProductCardRow
                key={product.id}
                product={product}
                isSelected={selectedProducts.has(product.id)}
                onToggleSelect={handleToggleSelect}
                subdomain={subdomain}
              />
            ))}
          </>
        )}
      </div>

      {/* Bulk actions toolbar - shown when items are selected */}
      {selectedProducts.size > 0 && (
        <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-lg border bg-card p-3 shadow-lg">
          <span className="text-sm font-medium">
            {selectedProducts.size} seleccionado(s)
          </span>
          <div className="h-4 w-px bg-border" />
          {/* TODO: Implement bulk action buttons in Task 7.6 */}
          <span className="text-xs text-muted-foreground">
            Acciones en lote próximamente
          </span>
        </div>
      )}
    </div>
  );
}
