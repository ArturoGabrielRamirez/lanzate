import type {
  ProductTableVariant,
  ProductTableStockItem,
  ProductTableOptionValue,
} from "@/features/products/types";

/**
 * Calcula el stock total de una variante sumando todos sus stock_items
 * @param variant - Variante del producto
 * @returns Total de unidades en stock
 */
export function getTotalStock(variant: ProductTableVariant): number {
  return variant.stock_items?.reduce(
    (sum: number, item: ProductTableStockItem) => sum + item.quantity,
    0
  ) || 0;
}

/**
 * Genera el label de una variante basado en sus option_values
 * @param variant - Variante del producto
 * @returns String formateado con los valores de opciones (ej: "Rojo / Grande")
 */
export function getVariantLabel(variant: ProductTableVariant): string {
  if (!variant.option_values || variant.option_values.length === 0) {
    return "Default";
  }

  return variant.option_values
    .map((ov: ProductTableOptionValue) => ov.value.value)
    .join(" / ");
}
