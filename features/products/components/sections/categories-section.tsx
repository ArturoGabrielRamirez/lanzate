"use client"

import CategorySelect from "@/features/store-landing/components/category-select-"
import type { CategoryValue, CategoriesSectionData } from "@/features/products/type/create-form-extra"

type Props = {
    storeId?: number
    value?: CategoriesSectionData
    onChange?: (data: CategoriesSectionData) => void
}

export function CategoriesSection({ storeId, value, onChange }: Props) {
    function handleAddCategory(v: CategoryValue[]) {
        onChange?.({ categories: v })
    }

    return (
        <CategorySelect onChange={handleAddCategory} storeId={storeId} />
    )
}

export default CategoriesSection


