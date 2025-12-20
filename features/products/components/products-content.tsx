"use client";

import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";

import {
  SelectLayoutGroup,
  ToggleLayoutCell,
  ToggleLayoutContainer,
  useToggleLayoutContext,
} from "@/components/systaliko-ui/ecommerce/toggle-layout";
import { ProductCardItem } from "@/features/products/components/product-card-item";
import { ProductListItem } from "@/features/products/components/product-list-item";
import type {
  ProductWithRelations,
  ProductsContentProps,
} from "@/features/products/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shadcn/components/ui/select";

/**
 * Componente que maneja los controles (sorting, limit, layout toggle)
 * y renderiza el grid/lista de productos
 */
export function ProductsContent({
  data,
  loading,
  limit,
  setLimit,
  orderBy,
  setOrderBy,
  startTransition,
}: ProductsContentProps) {
  const { modeIndex } = useToggleLayoutContext();

  return (
    <>
      {/* Fila de controles */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        {/* OrderBy Select */}
        <Select
          value={orderBy || "created_at-desc"}
          onValueChange={(value) => {
            startTransition(() => {
              setOrderBy(value);
            });
          }}
          disabled={loading}
        >
          <SelectTrigger size="sm" className="w-40 bg-card">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name ↑</SelectItem>
            <SelectItem value="name-desc">Name ↓</SelectItem>
            <SelectItem value="price-asc">Price ↑</SelectItem>
            <SelectItem value="price-desc">Price ↓</SelectItem>
            <SelectItem value="created_at-asc">Created ↑</SelectItem>
            <SelectItem value="created_at-desc">Created ↓</SelectItem>
          </SelectContent>
        </Select>

        {/* Limit Select */}
        <Select
          value={limit?.toString() || "5"}
          onValueChange={(value) => {
            startTransition(() => {
              setLimit(value);
            });
          }}
          disabled={loading}
        >
          <SelectTrigger size="sm" className="w-16 bg-card">
            <SelectValue placeholder="Limit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
          </SelectContent>
        </Select>

        {/* Toggle List/Grid */}
        <SelectLayoutGroup className="ml-auto" />
      </div>

      {/* Grid de productos */}
      <ToggleLayoutContainer>
        {data.map((product: ProductWithRelations) => {
          return (
            <ToggleLayoutCell key={product.id}>
              <AnimatePresence key={modeIndex} mode="sync">
                {modeIndex === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.1 } }}
                    exit={{ opacity: 0.5 }}
                  >
                    <ProductListItem product={product} />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 , transition: { delay: 0.1 } }}
                    exit={{ opacity: 0.5 }}
                  >
                    <ProductCardItem product={product} />
                  </motion.div>
                )}
              </AnimatePresence>
            </ToggleLayoutCell>
          );
        })}
      </ToggleLayoutContainer>
    </>
  );
}
