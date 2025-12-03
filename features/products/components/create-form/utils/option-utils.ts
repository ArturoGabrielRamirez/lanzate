// Simple ID generator
export const generateId = () => Math.random().toString(36).substring(2, 9)

// Generate Variants based on Options
export function generateVariants<T extends { id?: string; name?: string; sku?: string; price: number; stock: number }>(
    currentOptions: Array<{
        name: string
        values?: Array<{ id?: string; value: string }>
    }>,
    existingVariants: T[] = []
): T[] {
    if (currentOptions.length === 0) return []

    const validOptions = currentOptions.filter(opt => opt.name && opt.values && opt.values.length > 0)
    if (validOptions.length === 0) return []

    const optionValuesArrays = validOptions.map(opt => opt.values!.map(v => ({
        optionName: opt.name,
        value: v.value
    })))

    // Cartesian product helper
    const cartesianProduct = <U,>(arrays: U[][]): U[][] => {
        return arrays.reduce<U[][]>((acc, curr) => {
            return acc.flatMap(x => curr.map(y => [...x, y]));
        }, [[]] as U[][]);
    }

    const combinations = cartesianProduct(optionValuesArrays)

    return combinations.map((combo) => {
        const name = combo.map(c => c.value).join(" / ")
        // Preserve existing variant data if name matches
        const existing = existingVariants.find(v => v.name === name)
        return {
            id: existing?.id || generateId(),
            name,
            sku: existing?.sku || "",
            price: existing?.price || 0,
            stock: existing?.stock || 0
        } as T
    })
}

