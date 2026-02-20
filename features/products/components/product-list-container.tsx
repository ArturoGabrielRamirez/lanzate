'use client';

import { useState } from 'react';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';

import { ProductCardRow } from '@/features/products/components/product-card-row';
import { PRODUCT_UI_MESSAGES } from '@/features/products/constants';
import type { ProductListContainerProps, ProductStatus } from '@/features/products/types';

/**
 * ProductListContainer Component
 *
 * Client component that displays products using BaseCard in row layout.
 * Uses nuqs for URL state management to sync search params with URL.
 *
 * Features:
 * - URL-synced search, filter, sort, and pagination
 * - Header row with column labels
 * - Product rows using ProductCardRow components
 * - Client-side bulk selection state
 * - Empty state when no products found
 *
 * URL Parameters (managed by nuqs):
 * - search: string (product name/SKU search)
 * - status: ProductStatus enum (ACTIVE, DRAFT, ARCHIVED)
 * - sort: string (name, createdAt, updatedAt, price, stock)
 * - page: number (current page)
 * - pageSize: number (items per page)
 */
export function ProductListContainer({
  products,
  total,
  storeId,
  subdomain,
}: ProductListContainerProps) {
  // Bulk selection state
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  // nuqs search params state management
  const [searchParams, setSearchParams] = useQueryStates({
    search: parseAsString.withDefault(''),
    status: parseAsString.withDefault(''),
    sort: parseAsString.withDefault('createdAt'),
    page: parseAsInteger.withDefault(1),
    pageSize: parseAsInteger.withDefault(10),
  });

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

  // Toggle select all on current page
  const handleToggleSelectAll = () => {
    if (selectedProducts.size === products.length) {
      // Deselect all
      setSelectedProducts(new Set());
    } else {
      // Select all on current page
      setSelectedProducts(new Set(products.map((p) => p.id)));
    }
  };

  // Check if all products on current page are selected
  const allSelected = products.length > 0 && selectedProducts.size === products.length;
  const someSelected = selectedProducts.size > 0 && !allSelected;

  // Empty state
  if (products.length === 0) {
    return (
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
          {PRODUCT_UI_MESSAGES.NO_PRODUCTS_DESCRIPTION.es}
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-1.5">
      {/* Header row with column labels */}
      <div className="flex items-center px-4 py-1.5">
        {/* Checkbox column + Product column */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(input) => {
              if (input) {
                input.indeterminate = someSelected;
              }
            }}
            onChange={handleToggleSelectAll}
            className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0"
            aria-label="Seleccionar todos"
          />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Producto
          </span>
        </div>

        {/* SKU column */}
        <span className="min-w-0 flex-1 px-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          SKU
        </span>

        {/* Status column */}
        <span className="min-w-0 flex-1 px-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Estado
        </span>

        {/* Price column */}
        <span className="min-w-0 flex-1 px-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Precio
        </span>

        {/* Stock column */}
        <span className="min-w-0 flex-1 px-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Stock
        </span>

        {/* Actions column */}
        <div className="w-auto shrink-0 px-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Acciones
        </div>
      </div>

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
