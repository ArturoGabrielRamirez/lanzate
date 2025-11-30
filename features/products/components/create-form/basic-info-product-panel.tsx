"use client"

import { Barcode, Box, Link, Tag } from "lucide-react"
import { useCallback, useEffect } from "react"
import { useFormContext } from "react-hook-form"

import { InputField } from "@/features/global/components/form/input-field"
import { TextareaField } from "@/features/global/components/form/textarea-field"
import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider"
import { CreateProductFormType } from "@/features/products/schemas/create-product-form-schema"

export function BasicInfoProductPanel() {
    
    const { setValue, formState: { isValid, disabled }, trigger } = useFormContext<CreateProductFormType>()
    const { values, setValues, setStepValid } = useCreateProductContext()
    
    // Sync context with form state on mount
    useEffect(() => {
        trigger(["basic_info.name"])
        setValue("basic_info.name", values.basic_info?.name || "")
        setValue("basic_info.description", values.basic_info?.description || "")
        setValue("basic_info.slug", values.basic_info?.slug || "")
        setValue("basic_info.sku", values.basic_info?.sku || "")
        setValue("basic_info.barcode", values.basic_info?.barcode || "")
    }, [])

    // Validate step
    useEffect(() => {
        setStepValid(1, isValid)
    }, [isValid, setStepValid])

    const handleInputChange = useCallback((field: keyof CreateProductFormType['basic_info']) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val = e.target.value
        setValues({ basic_info: { ...values.basic_info, [field]: val } })
        setValue(`basic_info.${field}`, val, { shouldValidate: true, shouldDirty: true })
    }, [setValues, setValue, values])

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    name="basic_info.name"
                    label="Nombre del producto"
                    placeholder="Ej: Camiseta Negra"
                    startIcon={<Box />}
                    isRequired
                    onChange={handleInputChange("name")}
                    disabled={disabled}
                    tooltip="El nombre del producto es el nombre que se mostrará en el catálogo de productos."
                />
                <InputField
                    name="basic_info.slug"
                    label="Slug (URL)"
                    placeholder="ej-camiseta-negra"
                    startIcon={<Link />}
                    onChange={handleInputChange("slug")}
                    disabled={disabled}
                    tooltip="El slug es la URL del producto. Debe ser único y no debe contener espacios."
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    name="basic_info.sku"
                    label="SKU"
                    placeholder="CAM-NEG-001"
                    startIcon={<Tag />}
                    onChange={handleInputChange("sku")}
                    disabled={disabled}
                    tooltip="El SKU es el código único del producto. Debe ser único y no debe contener espacios."
                />
                <InputField
                    name="basic_info.barcode"
                    label="Código de barras"
                    placeholder="123456789"
                    onChange={handleInputChange("barcode")}
                    startIcon={<Barcode />}
                    disabled={disabled}
                    tooltip="El código de barras es el código único del producto. Debe ser único y no debe contener espacios."
                />
            </div>
            <TextareaField
                name="basic_info.description"
                label="Descripción"
                placeholder="Descripción detallada del producto..."
                onChange={handleInputChange("description")}
                disabled={disabled}
            />
        </div>
    )
}

