"use client"

import { Barcode, Infinity, Package, RefreshCcw, Tag } from "lucide-react"
import { useCallback, useEffect } from "react"
import { useFormContext } from "react-hook-form"

import { InputField } from "@/features/global/components/form/input-field"
import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider"
import { CreateProductFormType } from "@/features/products/schemas/create-product-form-schema"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"

interface SimpleProductFieldsProps {
    disabled?: boolean
}

export function SimpleProductFields({ disabled }: SimpleProductFieldsProps) {
    const { watch, setValue, trigger, formState: { disabled: formDisabled } } = useFormContext<CreateProductFormType>()
    const { values, setValues: setCtxValues } = useCreateProductContext()
    const { price_stock_info } = values

    const stockUnlimited = watch("price_stock_info.stock_unlimited")
    const isDisabled = disabled || formDisabled

    // Initialize from context
    useEffect(() => {
        if (price_stock_info) {
            setValue("price_stock_info.sku", price_stock_info.sku || "")
            setValue("price_stock_info.barcode", price_stock_info.barcode || "")
            setValue("price_stock_info.price", price_stock_info.price || 0)
            setValue("price_stock_info.promotional_price", price_stock_info.promotional_price || null)
            setValue("price_stock_info.cost", price_stock_info.cost || 0)
            setValue("price_stock_info.stock", price_stock_info.stock || 0)
            setValue("price_stock_info.stock_unlimited", price_stock_info.stock_unlimited || false)
            setValue("price_stock_info.track_stock", price_stock_info.track_stock ?? true)
            trigger(["price_stock_info.price", "price_stock_info.stock", "price_stock_info.stock_unlimited"])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // Run once on mount

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

    const handlePromotionalPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === "" ? null : (parseFloat(e.target.value) || 0)
        setCtxValues({
            ...values,
            price_stock_info: {
                ...values.price_stock_info,
                promotional_price: value
            }
        })
        setValue("price_stock_info.promotional_price", value, { shouldValidate: true, shouldDirty: true })
    }, [setCtxValues, setValue, values])

    const handleCostChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) || 0
        setCtxValues({
            ...values,
            price_stock_info: {
                ...values.price_stock_info,
                cost: value
            }
        })
        setValue("price_stock_info.cost", value, { shouldValidate: true, shouldDirty: true })
    }, [setCtxValues, setValue, values])

    const handleStockChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) || 0
        setCtxValues({
            ...values,
            price_stock_info: {
                ...values.price_stock_info,
                stock: value
            }
        })
        setValue("price_stock_info.stock", value, { shouldValidate: true, shouldDirty: true })
    }, [setCtxValues, setValue, values])

    const handleSkuChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setCtxValues({
            ...values,
            price_stock_info: {
                ...values.price_stock_info,
                sku: value
            }
        })
        setValue("price_stock_info.sku", value, { shouldValidate: true, shouldDirty: true })
    }, [setCtxValues, setValue, values])

    const handleBarcodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setCtxValues({
            ...values,
            price_stock_info: {
                ...values.price_stock_info,
                barcode: value
            }
        })
        setValue("price_stock_info.barcode", value, { shouldValidate: true, shouldDirty: true })
    }, [setCtxValues, setValue, values])

    const handleStockUnlimitedChange = useCallback((checked: boolean) => {
        setCtxValues({
            ...values,
            price_stock_info: {
                ...values.price_stock_info,
                stock_unlimited: checked
            }
        })
        setValue("price_stock_info.stock_unlimited", checked, { shouldValidate: true, shouldDirty: true })
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
                    disabled={isDisabled}
                />
                <InputField
                    name="price_stock_info.promotional_price"
                    label="Precio promocional"
                    placeholder="0.00"
                    type="number"
                    startIcon="$"
                    tooltip="Si se establece, este será el precio actual"
                    onChange={handlePromotionalPriceChange}
                    disabled={isDisabled}
                />
                <InputField
                    name="price_stock_info.cost"
                    label="Costo"
                    placeholder="0.00"
                    type="number"
                    startIcon="$"
                    tooltip="Para cálculo de ganancias (no visible al cliente)"
                    onChange={handleCostChange}
                    disabled={isDisabled}
                />
            </div>

            <InputField
                name="price_stock_info.stock"
                label="Stock disponible"
                placeholder="0"
                type="number"
                disabled={stockUnlimited || isDisabled}
                startIcon={<Package />}
                tooltip="Stock disponible total para la venta"
                isRequired
                onChange={handleStockChange}
                endIcon={(
                    <>
                        <IconButton
                            icon={Infinity}
                            tooltip="Stock ilimitado"
                            active={stockUnlimited}
                            onClick={() => {
                                handleStockUnlimitedChange(!stockUnlimited)
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
                    onChange={handleSkuChange}
                    disabled={isDisabled}
                />
                <InputField
                    name="price_stock_info.barcode"
                    label="Código de barras"
                    placeholder="7791234567890"
                    startIcon={<Barcode />}
                    tooltip="Código de barras (EAN, UPC, etc.)"
                    onChange={handleBarcodeChange}
                    disabled={isDisabled}
                />
            </div>
        </div>
    )
}

