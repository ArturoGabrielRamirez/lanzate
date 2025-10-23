"use client"

import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"

import type { CategoryValue, CategoriesSectionData } from "@/features/products/types/create-form-extra"
import { getCategoriesAction } from "@/features/stores/actions/get-categories.action"
import { CategorySelect } from "@/features/stores/components/category-select-"

type Props = {
    storeId?: number
    value?: CategoriesSectionData
    onChange?: (data: CategoriesSectionData) => void
}

function CategoriesSection({ storeId, value, onChange }: Props) {
    const { watch, setValue } = useFormContext()
    const categories = (watch('categories') as CategoryValue[] | undefined) ?? (value?.categories ?? [])
    const [initialCategories, setInitialCategories] = useState<{ label: string, value: number }[] | undefined>(undefined)

    // Prefetch categories as soon as section mounts (and storeId is known)
    useEffect(() => {
        let mounted = true
        const load = async () => {
            if (!storeId) return
            const { payload, hasError } = await getCategoriesAction(storeId)
            if (hasError || !payload) return
            if (!mounted) return
            setInitialCategories(payload.map((c) => ({ label: c.name, value: c.id })))
        }
        load()
        return () => { mounted = false }
    }, [storeId])

    function handleAddCategory(v: CategoryValue[]) {
        setValue('categories', v, { shouldValidate: true, shouldDirty: true })
        onChange?.({ categories: v })
    }

    return (
        <CategorySelect
            defaultValue={categories}
            onChange={handleAddCategory}
            storeId={storeId}
            initialCategories={initialCategories}
        />
    )
}

export { CategoriesSection }


