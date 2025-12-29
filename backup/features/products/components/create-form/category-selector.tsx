"use client"

import { Layers, Loader2 } from "lucide-react"
import { useCallback, useEffect, useState, useTransition } from "react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"

import { createCategoryDynamicAction } from "@/features/categories/actions/create-category-dynamic.action"
import { getStoreCategoriesAction } from "@/features/categories/actions/get-store-categories.action"
import { TagsField, TagOption } from "@/features/global/components/form/tags-field"
import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider"
import { CreateProductFormType } from "@/features/products/schemas/create-product-form-schema"

export function CategorySelector({ storeId, options }: { storeId?: number, options?: TagOption[] }) {
    const { setValue, formState: { disabled } } = useFormContext<CreateProductFormType>()
    const { values, setValues } = useCreateProductContext()
    const [isPending, startTransition] = useTransition()
    const [categoryOptions, setCategoryOptions] = useState<TagOption[]>(options || [])

    useEffect(() => {
        if (options) {
            setCategoryOptions(options)
            return
        }

        if (!storeId || isNaN(storeId)) return

        startTransition(async () => {
            const result = await getStoreCategoriesAction({ storeId })
            if (result.error) {
                toast.error("No se pudieron cargar las categorías")
                return
            }
            
            const mappedOptions = result.payload.map((cat: { name: string }) => ({
                value: cat.name,
                label: cat.name
            }))
            setCategoryOptions(mappedOptions)
        })
    }, [storeId, options])

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
            const currentCategories = (values.basic_info?.categories || []) as string[]
            // Check if payload returned and has name, otherwise use input
            const createdName = (result.payload?.name || newCategoryName) as string
            
            handleCategoriesChange([...currentCategories, createdName])
            
            // Add to options if not present
            setCategoryOptions(prev => {
                const nameToAdd = createdName || newCategoryName
                if (prev.some(o => o.value === nameToAdd)) return prev
                return [...prev, { value: nameToAdd, label: nameToAdd }]
            })
        })
    }

    return (
        <TagsField
            name="basic_info.categories"
            label="Categorías"
            placeholder="Seleccionar categorías..."
            onChange={handleCategoriesChange}
            onCreate={handleCreateCategory}
            disabled={disabled}
            isLoading={isPending}
            loadingMessage="Creando nueva categoría..."
            tooltip="Las categorías ayudan a organizar tus productos."
            startIcon={<Layers />}
            endIcon={isPending ? <Loader2 className="animate-spin" /> : undefined}
            options={categoryOptions}
        />
    )
}

