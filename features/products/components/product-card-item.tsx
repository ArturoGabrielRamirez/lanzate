"use client";

import type {
  ProductTableVariant,
  ProductCardItemProps,
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
import { Card, CardHeader } from "@/features/shadcn/components/ui/card";

/**
 * Componente para mostrar un producto en vista card/grid
 */
export function ProductCardItem({ product }: ProductCardItemProps) {
  const priceRange = getPriceRange(product.variants || []);
  const variantCount = product.variants?.length || 0;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          {product.is_featured && (
            <Badge variant="default" className="shrink-0">
              ⭐ Featured
            </Badge>
          )}
        </div>
        <div className="space-y-1 mt-2">
          <p className="text-2xl font-bold text-primary">{priceRange.display}</p>
          <p className="text-sm text-muted-foreground">
            {variantCount} {variantCount === 1 ? 'variant' : 'variants'}
          </p>
        </div>
      </CardHeader>

      {/* Accordion de variantes */}
      {variantCount > 0 && (
        <div className="px-6 pb-6 mt-auto">
          <Accordion type="single" collapsible>
            <AccordionItem value="variants" className="border-0">
              <AccordionTrigger className="py-2 hover:no-underline">
                <span className="text-sm font-medium">View variants</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 mt-2">
                  {product.variants.map((variant: ProductTableVariant) => {
                    const totalStock = getTotalStock(variant);
                    const label = getVariantLabel(variant);

                    return (
                      <div
                        key={variant.id}
                        className="p-3 bg-secondary/50 rounded-md space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{label}</span>
                          <Badge variant="outline" className="text-xs">
                            ${variant.price.toFixed(2)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Stock: {totalStock} units
                        </p>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </Card>
  );
}
