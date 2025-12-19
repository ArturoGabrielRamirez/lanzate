import type { ProductsTableVariantRow } from "@/features/products/types"
import type { ProductWithRelations } from "@/features/products/types/products-by-store.types"
import { buildVariantLabel, calculateVariantStock } from "@/features/products/utils/variant-helpers"

/**
 * Flattens products with variants into row entries used by the tnks DataTable.
 */
export function flattenProducts(products: ProductWithRelations[]): ProductsTableVariantRow[] {
    const rows: ProductsTableVariantRow[] = []

    for (const product of products) {
        const variants = product.variants ?? []

        if (variants.length === 0) {
            rows.push({
                ...product,
                row_id: `${product.id}-base`,
                variant_id: undefined,
                variant_label: undefined,
                stock: product.stock ?? 0,
                variant_price: product.price ?? undefined,
            })
            continue
        }

        for (const variant of variants) {
            rows.push({
                ...product,
                row_id: `${product.id}-${variant.id}`,
                stock: calculateVariantStock(variant),
                variant_id: variant.id,
                variant_label: buildVariantLabel(variant),
                variant_price: variant.price ?? undefined,
            })
        }
    }

    return rows
}

