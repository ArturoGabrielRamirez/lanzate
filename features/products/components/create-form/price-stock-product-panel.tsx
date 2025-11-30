"use client"

import { DollarSign } from "lucide-react"
import { useCallback, useEffect } from "react"
import { useFormContext } from "react-hook-form"

import { InputField } from "@/features/global/components/form/input-field"
import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider"
import { CreateProductFormType } from "@/features/products/schemas/create-product-form-schema"

export function PriceStockProductPanel() {
    
    const { setValue, formState: { isValid, disabled }, trigger } = useFormContext<CreateProductFormType>()
    const { values, setValues, setStepValid } = useCreateProductContext()
    
    useEffect(() => {
        trigger(["price_stock_info.price", "price_stock_info.stock"])
        setValue("price_stock_info.price", values.price_stock_info?.price || 0)
        setValue("price_stock_info.stock", values.price_stock_info?.stock || 0)
        setValue("price_stock_info.cost", values.price_stock_info?.cost || 0)
    }, [])

    useEffect(() => {
        setStepValid(3, isValid)
    }, [isValid, setStepValid])

    const handleNumberChange = useCallback((field: keyof CreateProductFormType['price_stock_info']) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value) || 0
        setValues({ price_stock_info: { ...values.price_stock_info, [field]: val } })
        setValue(`price_stock_info.${field}`, val, { shouldValidate: true })
    }, [setValues, setValue, values])

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                    name="price_stock_info.price"
                    label="Precio"
                    type="number"
                    startIcon={<DollarSign />}
                    isRequired
                    onChange={handleNumberChange("price")}
                    disabled={disabled}
                    placeholder="0"
                />
                <InputField
                    name="price_stock_info.stock"
                    label="Stock"
                    type="number"
                    isRequired
                    onChange={handleNumberChange("stock")}
                    disabled={disabled}
                    placeholder="0"
                />
                 <InputField
                    name="price_stock_info.cost"
                    label="Costo (Opcional)"
                    type="number"
                    startIcon={<DollarSign />}
                    onChange={handleNumberChange("cost")}
                    disabled={disabled}
                    placeholder="0"
                />
            </div>
        </div>
    )
}

