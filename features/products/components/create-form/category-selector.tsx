"use client"

import { Layers } from "lucide-react"
import { useCallback, useTransition } from "react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"

import { createCategoryDynamicAction } from "@/features/categories/actions/create-category-dynamic.action"
import { TagsField } from "@/features/global/components/form/tags-field"
import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider"
import { CreateProductFormType } from "@/features/products/schemas/create-product-form-schema"

export function CategorySelector({ storeId }: { storeId?: number }) {
    const { setValue, formState: { disabled } } = useFormContext<CreateProductFormType>()
    const { values, setValues } = useCreateProductContext()
    const [isPending, startTransition] = useTransition()

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

    const handleCreateCategory = (newCategoryName: string) => {
        if (!newCategoryName.trim()) return
        
        if (!storeId || isNaN(storeId)) {
            toast.error("Error: No se pudo identificar la tienda")
            return
        }

        startTransition(async () => {
            const result = await createCategoryDynamicAction({
                storeId,
                categoryName: newCategoryName
            })

            if (result.error) {
                toast.error(result.message)
                return
            }

            toast.success(result.message)
            
            // Add the new category to the selection
            const currentCategories = values.basic_info?.categories || []
            // Check if payload returned and has name, otherwise use input
            const createdName = result.payload?.name || newCategoryName
            
            handleCategoriesChange([...currentCategories, createdName])
        })
    }

    return (
        <TagsField
            name="basic_info.categories"
            label="Categorías"
            placeholder="Seleccionar categorías..."
            onChange={handleCategoriesChange}
            onCreate={handleCreateCategory}
            disabled={disabled || isPending}
            tooltip="Las categorías ayudan a organizar tus productos."
            startIcon={<Layers />}
        />
    )
}

