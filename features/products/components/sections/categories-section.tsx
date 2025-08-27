"use client"

import CategorySelect from "@/features/store-landing/components/category-select-"
import type { CategoryValue, CategoriesSectionData } from "@/features/products/type/create-form-extra"
import { useFormContext } from "react-hook-form"

type Props = {
    storeId?: number
    value?: CategoriesSectionData
    onChange?: (data: CategoriesSectionData) => void
}

export function CategoriesSection({ storeId, value, onChange }: Props) {
    const { watch, setValue } = useFormContext()
    const categories = (watch('categories') as CategoryValue[] | undefined) ?? (value?.categories ?? [])

    function handleAddCategory(v: CategoryValue[]) {
        setValue('categories', v, { shouldValidate: true, shouldDirty: true })
        onChange?.({ categories: v })
    }

    return (
        <CategorySelect defaultValue={categories} onChange={handleAddCategory} storeId={storeId} />
    )
}

export default CategoriesSection


