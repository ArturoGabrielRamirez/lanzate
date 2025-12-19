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
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/features/shadcn/components/item";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/features/shadcn/components/ui/accordion";
import { Badge } from "@/features/shadcn/components/ui/badge";
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/features/shadcn/components/ui/card";
import { Crown } from "lucide-react";

export function ProductListItem({ product }: ProductListItemProps) {
  const priceRange = getPriceRange(product.variants || []);
  const variantCount = product.variants?.length || 0;

  return (
    <Card className="gap-0! py-3!">
      <CardHeader>
        <CardTitle className="gap-2 flex items-center">
          <span className="font-medium">{product.name}</span>
          {product.is_featured && (
            <Badge variant="secondary" className="text-xs">
              <Crown />
            </Badge>
          )}
        </CardTitle>
        <CardAction>
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            {priceRange.display}
          </div>
        </CardAction>
      </CardHeader>
      <CardFooter>
        {variantCount > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={`${product.id}`} className="border-0">
              <AccordionTrigger className="text-xs font-normal hover:no-underline w-full py-0 text-muted-foreground/50">
                {variantCount} {variantCount === 1 ? "variant" : "variants"}
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="space-y-2">
                  {product.variants.map((variant: ProductTableVariant) => {
                    const totalStock = getTotalStock(variant);
                    const label = getVariantLabel(variant);

                    return (
                      <Item key={variant.id} size="sm" variant="outline">
                        <ItemContent>
                          <ItemTitle>{label}</ItemTitle>
                          <ItemDescription>Stock: {totalStock}</ItemDescription>
                        </ItemContent>
                        <ItemActions>
                          <span>${variant.price.toFixed(2)}</span>
                        </ItemActions>
                      </Item>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardFooter>
    </Card>
  );
}
