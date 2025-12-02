"use client"

import { Barcode, Tag } from "lucide-react"
import { useEffect } from "react"
import { Separator } from "react-aria-components"
import { useFormContext } from "react-hook-form"

import { InputField } from "@/features/global/components/form/input-field"
import { SwitchField } from "@/features/global/components/form/switch-field"
import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider"
import { VariantsTable } from "@/features/products/components/create-form/variants-table"
import { CreateProductFormType } from "@/features/products/schemas/create-product-form-schema"
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from "@/features/shadcn/components/item"

// Helper for currency formatting if not available
const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(amount)
}

export function PriceStockProductPanel() {
    const { watch } = useFormContext<CreateProductFormType>()
    const { setStepValid, values } = useCreateProductContext()

    //const hasVariants = watch("options_variants_info.has_variants")
    const hasVariants = values.options_variants_info.has_variants
    //const variants = watch("options_variants_info.variants") || []
    const variants = values.options_variants_info.variants || []

    const price = watch("price_stock_info.price")
    const stock = watch("price_stock_info.stock")
    const stockUnlimited = watch("price_stock_info.stock_unlimited")

    useEffect(() => {
        let isValid = true
        if (hasVariants) {
            // In variants mode, if we have variants, we assume it's valid (details validated in previous step or implicitly here)
            // Maybe check if all variants have valid price?
            // The previous step validates existence of variants.
            if (variants.length === 0) isValid = false
        } else {
            // Standard mode
            if (price === undefined || price < 0) isValid = false
            if (!stockUnlimited && (stock === undefined || stock < 0)) isValid = false
            // Add more checks if needed based on schema
        }
        setStepValid(4, isValid)
    }, [/* hasVariants, variants, price, stock, stockUnlimited, setStepValid */hasVariants])

    if (hasVariants) {
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

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                    name="price_stock_info.sku"
                    label="SKU"
                    placeholder="SKU-001"
                    startIcon={<Tag />}
                    tooltip="Código único de identificación del producto"
                />
                <InputField
                    name="price_stock_info.barcode"
                    label="Código de barras"
                    placeholder="7791234567890"
                    startIcon={<Barcode />}
                    tooltip="Código de barras (EAN, UPC, etc.)"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField
                    name="price_stock_info.price"
                    label="Precio de venta"
                    placeholder="0.00"
                    type="number"
                    startIcon="$"
                    isRequired
                />
                <InputField
                    name="price_stock_info.promotional_price"
                    label="Precio promocional"
                    placeholder="0.00"
                    type="number"
                    startIcon="$"
                    tooltip="Si se establece, este será el precio actual"
                />
                <InputField
                    name="price_stock_info.cost"
                    label="Costo"
                    placeholder="0.00"
                    type="number"
                    startIcon="$"
                    tooltip="Para cálculo de ganancias (no visible al cliente)"
                />
            </div>

            <Separator />
            <div className="flex gap-4 flex-col">
                <InputField
                    name="price_stock_info.stock"
                    label="Stock disponible"
                    placeholder="0"
                    type="number"
                    disabled={stockUnlimited}
                />
                <div className="flex flex-col gap-2">


                    <SwitchField
                        name="price_stock_info.stock_unlimited"
                        label="Stock ilimitado"
                        description="Para productos digitales o servicios"
                    />
                    <Separator />
                    <SwitchField
                        name="price_stock_info.track_stock"
                        label="Rastrear stock"
                        description="Actualizar automáticamente"
                    />
                    <Separator />
                </div>
            </div>

        </div>
    )
}
