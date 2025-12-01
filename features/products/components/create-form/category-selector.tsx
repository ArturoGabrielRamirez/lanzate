"use client"

import { Layers } from "lucide-react"
import { useCallback } from "react"
import { useFormContext } from "react-hook-form"

import { TagsField } from "@/features/global/components/form/tags-field"
import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider"
import { CreateProductFormType } from "@/features/products/schemas/create-product-form-schema"

export function CategorySelector() {
    const { setValue, formState: { disabled } } = useFormContext<CreateProductFormType>()
    const { values, setValues } = useCreateProductContext()

    const handleCategoriesChange = useCallback((categories: string[]) => {
        // Ensure basic_info exists to avoid undefined errors if called early
        const currentBasicInfo = values.basic_info || {}
        setValues({ 
            ...values, 
            basic_info: { 
                ...currentBasicInfo, 
                categories 
            } 
        })
        setValue("basic_info.categories", categories, { shouldValidate: true, shouldDirty: true })
    }, [setValues, setValue, values])

    return (
        <TagsField
            name="basic_info.categories"
            label="Categorías"
            placeholder="Seleccionar categorías..."
            onChange={handleCategoriesChange}
            disabled={disabled}
            tooltip="Las categorías ayudan a organizar tus productos."
            startIcon={<Layers />}
        />
    )
}

