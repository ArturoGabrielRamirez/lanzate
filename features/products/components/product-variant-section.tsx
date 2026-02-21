"use client";

import { useState, useCallback } from 'react';

import { VariantSelector } from '@/features/products/components/variant-selector';
import type { ProductVariantSectionProps, VariantWithRelations } from '@/features/products/types/product-detail.types';

export function ProductVariantSection({ variants }: ProductVariantSectionProps) {
  const [selectedVariant, setSelectedVariant] = useState<VariantWithRelations | undefined>(variants[0]);

  const handleVariantChange = useCallback((variant: VariantWithRelations) => {
    setSelectedVariant(variant);
  }, []);

  return (
    <>
      {/* Price display — reactive to variant selection */}
      <div className="mt-2">
        {selectedVariant ? (
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">
              ${Number(selectedVariant.price).toFixed(2)}
            </span>
            {selectedVariant.promotionalPrice &&
              Number(selectedVariant.promotionalPrice) < Number(selectedVariant.price) && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  ${Number(selectedVariant.price).toFixed(2)}
                </span>
                <span className="text-lg font-semibold text-red-500">
                  ${Number(selectedVariant.promotionalPrice).toFixed(2)}
                </span>
              </>
            )}
          </div>
        ) : (
          <span className="text-3xl font-bold text-muted-foreground">
            Precio no disponible
          </span>
        )}
      </div>

      {/* Mobile Variant Selector */}
      <div className="lg:hidden mt-4">
        <VariantSelector variants={variants} onVariantChange={handleVariantChange} />
      </div>

      {/* Desktop Variant Selector */}
      <div className="hidden lg:block mt-6">
        <VariantSelector variants={variants} onVariantChange={handleVariantChange} />
      </div>
    </>
  );
}
