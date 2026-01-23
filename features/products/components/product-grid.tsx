/**
 * Product Grid Component
 *
 * Responsive grid layout for displaying product cards.
 */

import type { Product, ProductImage, ProductVariant } from '@prisma/client';

import { ProductCard } from '@/features/products/components/product-card';

export interface ProductGridProps {
  products: (Product & {
    images?: ProductImage[];
    variants?: ProductVariant[];
  })[];
  storeSubdomain: string;
  emptyMessage?: string;
}

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
