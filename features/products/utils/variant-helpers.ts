import { ProductVariant, ProductVariantValue, VariantStock } from "@prisma/client"

type VariantWithRelations = ProductVariant & {
    option_values: (ProductVariantValue & {
        value: {
            value: string
            option: {
                name: string
            }
        }
    })[]
    stock_items: VariantStock[]
}

/**
 * Builds a variant label from option values
 * Groups option values by option name and formats them
 */
export function buildVariantLabel(variant: VariantWithRelations): string {
    if (!variant.option_values || variant.option_values.length === 0) {
        return "Variante"
    }

    // Group option values by option name
    const optionGroups = new Map<string, string[]>()
    
    for (const ov of variant.option_values) {
        const optionName = ov.value.option.name
        const optionValue = ov.value.value
        
        if (!optionGroups.has(optionName)) {
            optionGroups.set(optionName, [])
        }
        optionGroups.get(optionName)!.push(optionValue)
    }

    // Build label from grouped values
    const parts: string[] = []
    for (const [optionName, values] of optionGroups.entries()) {
        parts.push(`${optionName}: ${values.join(", ")}`)
    }

    return parts.join(" · ") || "Variante"
}

/**
 * Calculates total stock from variant stock items
 */
export function calculateVariantStock(variant: VariantWithRelations): number {
    if (!variant.stock_items || variant.stock_items.length === 0) {
        return 0
    }

    return variant.stock_items.reduce((sum, stock) => sum + (stock.quantity ?? 0), 0)
}

