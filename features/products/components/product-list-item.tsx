"use client";

import type {
  ProductTableVariant,
  ProductListItemProps,
} from "@/features/products/types";
import {
  getPriceRange,
  getTotalStock,
  getVariantLabel,
} from "@/features/products/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/features/shadcn/components/ui/accordion";
import { Badge } from "@/features/shadcn/components/ui/badge";

/**
 * Componente para mostrar un producto en vista lista (tipo tabla)
 */
export function ProductListItem({ product }: ProductListItemProps) {
  const priceRange = getPriceRange(product.variants || []);
  const variantCount = product.variants?.length || 0;

  return (
    <div className="border-b border-border">
      <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center p-4 hover:bg-muted/50 transition-colors">
        {/* Nombre + Featured */}
        <div className="flex items-center gap-2">
          <span className="font-medium">{product.name}</span>
          {product.is_featured && (
            <Badge variant="secondary" className="text-xs">
              Featured
            </Badge>
          )}
        </div>

        {/* Precio */}
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          {priceRange.display}
        </div>

        {/* Cantidad de variantes */}
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          {variantCount} {variantCount === 1 ? 'variant' : 'variants'}
        </div>

        {/* Espacio para accordion trigger */}
        <div className="w-8" />
      </div>

      {/* Accordion de variantes */}
      {variantCount > 0 && (
        <Accordion type="single" collapsible className="border-t border-border/50">
          <AccordionItem value="variants" className="border-0">
            <AccordionTrigger className="px-4 py-2 text-sm hover:no-underline">
              Ver variantes
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-2">
                {product.variants.map((variant: ProductTableVariant) => {
                  const totalStock = getTotalStock(variant);
                  const label = getVariantLabel(variant);

                  return (
                    <div
                      key={variant.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-md text-sm"
                    >
                      <span className="font-medium">{label}</span>
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <span>${variant.price.toFixed(2)}</span>
                        <span>Stock: {totalStock}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
