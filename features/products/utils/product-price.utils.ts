import type { ProductTableVariant, PriceRange } from "@/features/products/types";

/**
 * Calcula el rango de precios de un conjunto de variantes
 * @param variants - Array de variantes del producto
 * @returns Objeto con min, max y string formateado para display
 */
export function getPriceRange(variants: ProductTableVariant[]): PriceRange {
  if (variants.length === 0) {
    return { min: 0, max: 0, display: "N/A" };
  }

  const prices = variants.map(v => v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  if (min === max) {
    return { min, max, display: `$${min.toFixed(2)}` };
  }

  return { min, max, display: `$${min.toFixed(2)} - $${max.toFixed(2)}` };
}
