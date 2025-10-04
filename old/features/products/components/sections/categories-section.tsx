"use client"

import CategorySelect from "@/features/store-landing/components/category-select-"
import { useEffect, useMemo, useState } from "react"
import { getCategories } from "@/features/store-landing/actions/getCategories"
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
    const [initialCategories, setInitialCategories] = useState<{ label: string, value: number }[] | undefined>(undefined)

    // Prefetch categories as soon as section mounts (and storeId is known)
    useEffect(() => {
        let mounted = true
        const load = async () => {
            if (!storeId) return
            const { payload, error } = await getCategories(storeId)
            if (error) return
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

export default CategoriesSection


