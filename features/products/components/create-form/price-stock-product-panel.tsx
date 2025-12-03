"use client"

import { useEffect } from "react"

import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider"
import { VariantsTable } from "@/features/products/components/create-form/variants-table"
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from "@/features/shadcn/components/item"

// Helper for currency formatting if not available
const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(amount)
}

export function PriceStockProductPanel() {
    const { setStepValid, values } = useCreateProductContext()

    //const hasVariants = watch("options_variants_info.has_variants")
    const hasVariants = values.options_variants_info.has_variants
    //const variants = watch("options_variants_info.variants") || []
    const variants = values.options_variants_info.variants || []

    useEffect(() => {
        let isValid = true
        if (hasVariants) {
            // In variants mode, if we have variants, we assume it's valid (details validated in previous step or implicitly here)
            // Maybe check if all variants have valid price?
            // The previous step validates existence of variants.
            if (variants.length === 0) isValid = false
        } else {
            // For simple products, price and stock are validated in step 3, so this step is always valid
            isValid = true
        }
        setStepValid(4, isValid)
    }, [hasVariants, variants.length, setStepValid])

    if (!hasVariants) {
        // For simple products, price and stock are handled in the previous step
        return (
            <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
                <p className="text-sm text-muted-foreground">Los campos de precio y stock se completaron en el paso anterior.</p>
            </div>
        )
    }

    // For products with variants, show the variants table and summary
    const minPrice = variants.length > 0 ? Math.min(...variants.map(v => v.price)) : 0
    const totalStock = variants.length > 0 ? variants.reduce((acc, v) => acc + (v.stock || 0), 0) : 0

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">Detalle de Inventario</p>
                <VariantsTable />
            </div>
            <p className="text-sm font-medium">Resumen</p>
            <div className="grid grid-cols-3 gap-4">
                <Item variant="muted">
                    <ItemHeader>
                        <ItemTitle>Variantes</ItemTitle>
                    </ItemHeader>
                    <ItemContent>
                        <ItemDescription>
                            {variants.length}
                        </ItemDescription>
                    </ItemContent>
                </Item>
                <Item variant="muted">
                    <ItemHeader>
                        <ItemTitle>Precio más bajo</ItemTitle>
                    </ItemHeader>
                    <ItemContent>
                        <ItemDescription>
                            {formatMoney(minPrice)}
                        </ItemDescription>
                    </ItemContent>
                </Item>
                <Item variant="muted">
                    <ItemHeader>
                        <ItemTitle>Stock total</ItemTitle>
                    </ItemHeader>
                    <ItemContent>
                        <ItemDescription>
                            {totalStock}
                        </ItemDescription>
                    </ItemContent>
                </Item>
            </div>
        </div>
    )
}
