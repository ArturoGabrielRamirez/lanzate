/**
 * Product Card Component
 *
 * Card displaying a product with image, name, price, and cart button.
 * Used in product grids on the store detail page.
 */

import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import type { ProductCardProps } from '@/features/products/types';
import { Button } from '@/features/shadcn/components/ui/button';
import { cn } from '@/features/shadcn/utils/cn';

export function ProductCard({ product, storeSubdomain }: ProductCardProps) {
  // Get primary image or first image
  const primaryImage = product.images?.find((img) => img.isPrimary) ?? product.images?.[0];

  // Get lowest price from variants (starting at price)
  const lowestPrice = product.variants?.reduce((min, variant) => {
    const price = Number(variant.price);
    return price < min ? price : min;
  }, Infinity);

  const displayPrice = lowestPrice && lowestPrice !== Infinity ? lowestPrice : null;

  // Check promotional price
  const hasPromotion = product.variants?.some(
    (v) => v.promotionalPrice && Number(v.promotionalPrice) < Number(v.price)
  );

  return (
    <Link
      href={`/s/${storeSubdomain}/products/${product.slug}`}
      className="group block"
    >
      <div className="overflow-hidden rounded-2xl bg-card transition-all hover:shadow-md">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.altText || product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-4xl text-muted-foreground/50">
                {product.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {product.isNew && (
              <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-medium text-white">
                Nuevo
              </span>
            )}
            {product.isOnSale && (
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
                Oferta
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="line-clamp-2 text-sm font-medium text-foreground">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center justify-between">
            <div>
              {displayPrice !== null ? (
                <p className={cn(
                  'text-base font-semibold',
                  hasPromotion ? 'text-red-500' : 'text-primary'
                )}>
                  ${displayPrice.toFixed(2)}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">Sin precio</p>
              )}
            </div>
            <Button
              size="icon-sm"
              variant="ghost"
              className="h-8 w-8 rounded-full"
              onClick={(e) => {
                e.preventDefault();
                // TODO: Add to cart functionality
              }}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
