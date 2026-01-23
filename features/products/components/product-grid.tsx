/**
 * Product Grid Component
 *
 * Responsive grid layout for displaying product cards.
 */

import { ProductCard } from '@/features/products/components/product-card';
import type { ProductGridProps } from '@/features/products/types';

export function ProductGrid({
  products,
  storeSubdomain,
  emptyMessage = 'No hay productos disponibles',
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          storeSubdomain={storeSubdomain}
        />
      ))}
    </div>
  );
}
