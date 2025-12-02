"use client"

import { Barcode, Infinity, Package, RefreshCcw, Tag } from "lucide-react"
import { useCallback } from "react"
import { useFormContext } from "react-hook-form"

import { InputField } from "@/features/global/components/form/input-field"
import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider"
import { CreateProductFormType } from "@/features/products/schemas/create-product-form-schema"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"

interface SimpleProductFieldsProps {
    disabled?: boolean
    stockUnlimited: boolean
    onPromotionalPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onCostChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onStockChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onSkuChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onBarcodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onStockUnlimitedChange: (checked: boolean) => void
}

export function SimpleProductFields({
    disabled,
    stockUnlimited,
    onPromotionalPriceChange,
    onCostChange,
    onStockChange,
    onSkuChange,
    onBarcodeChange,
    onStockUnlimitedChange,
}: SimpleProductFieldsProps) {

    const { setValue } = useFormContext<CreateProductFormType>()
    const { values, setValues: setCtxValues } = useCreateProductContext()

    const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) || 0
        setCtxValues({
            ...values,
            price_stock_info: {
                ...values.price_stock_info,
                price: value
            }
        })
        setValue("price_stock_info.price", value, { shouldValidate: true, shouldDirty: true })
    }, [setCtxValues, setValue, values])

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                    name="price_stock_info.price"
                    label="Precio de venta"
                    placeholder="0.00"
                    type="number"
                    startIcon="$"
                    isRequired
                    tooltip="Precio de venta del producto"
                    onChange={handlePriceChange}
                    disabled={disabled}
                />
                <InputField
                    name="price_stock_info.promotional_price"
                    label="Precio promocional"
                    placeholder="0.00"
                    type="number"
                    startIcon="$"
                    tooltip="Si se establece, este será el precio actual"
                    onChange={onPromotionalPriceChange}
                    disabled={disabled}
                />
                <InputField
                    name="price_stock_info.cost"
                    label="Costo"
                    placeholder="0.00"
                    type="number"
                    startIcon="$"
                    tooltip="Para cálculo de ganancias (no visible al cliente)"
                    onChange={onCostChange}
                    disabled={disabled}
                />
            </div>

            <InputField
                name="price_stock_info.stock"
                label="Stock disponible"
                placeholder="0"
                type="number"
                disabled={stockUnlimited || disabled}
                startIcon={<Package />}
                tooltip="Stock disponible total para la venta"
                isRequired
                onChange={onStockChange}
                endIcon={(
                    <>
                        <IconButton
                            icon={Infinity}
                            tooltip="Stock ilimitado"
                            active={stockUnlimited}
                            onClick={() => {
                                onStockUnlimitedChange(!stockUnlimited)
                            }}
                            iconClassName={stockUnlimited ? "" : "text-muted-foreground"}
                        />
                        {/* track stock button */}
                        <IconButton
                            icon={RefreshCcw}
                            tooltip="Rastrear stock"
                            onClick={() => {
                                // TODO: Implement track stock
                            }}
                            iconClassName=""
                        />
                    </>
                )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    name="price_stock_info.sku"
                    label="SKU"
                    placeholder="SKU-001"
                    startIcon={<Tag />}
                    tooltip="Código único de identificación del producto"
                    onChange={onSkuChange}
                    disabled={disabled}
                />
                <InputField
                    name="price_stock_info.barcode"
                    label="Código de barras"
                    placeholder="7791234567890"
                    startIcon={<Barcode />}
                    tooltip="Código de barras (EAN, UPC, etc.)"
                    onChange={onBarcodeChange}
                    disabled={disabled}
                />
            </div>
        </div>
    )
}

