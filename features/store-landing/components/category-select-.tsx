"use client"
import { useState, useEffect } from "react";
import { getCategories } from "../actions/getCategories";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import MultipleSelector from "@/components/expansion/multiple-selector";
import { createCategoryDynamic } from "@/features/categories/actions/createCategoryDynamic";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type CategorySelectProps = {
    onChange?: (value: { label: string, value: string }[]) => void
    defaultValue?: { label: string, value: string }[]
    withLabel?: boolean
    storeId?: number
    className?: string
    initialCategories?: { label: string, value: number }[]
}

function CategorySelect({ onChange, defaultValue, withLabel = true, storeId, className, initialCategories }: CategorySelectProps) {

    const [categories, setCategories] = useState<{ label: string, value: number }[]>(initialCategories ?? [])
    const [creatingCategories, setCreatingCategories] = useState<Set<string>>(new Set())
    const [defaultSelectedCategories, setDefaultSelectedCategories] = useState<{ label: string, value: string }[]>([])

    const t = useTranslations("subdomain.sidebar.categories");

    // Seed categories from initialCategories when provided
    useEffect(() => {
        if (initialCategories && initialCategories.length > 0) {
            setCategories(initialCategories)
        }
    }, [initialCategories])

    // Fetch categories if not preloaded
    useEffect(() => {
        const fetchCategories = async () => {
            const { payload, error } = await getCategories(storeId)
            if (error) return console.log(error)
            const fetchedCategories = payload.map((cat) => ({ label: cat.name, value: cat.id }))
            setCategories(fetchedCategories)
        }
        if (storeId && categories.length === 0) {
            fetchCategories()
        }
    }, [storeId, categories.length])

    // Process defaultValue whenever categories are available
    useEffect(() => {
        if (defaultValue && Array.isArray(defaultValue) && defaultValue.length > 0 && categories.length > 0) {
            const processedDefaults = defaultValue.map((item: { label: string, value: string }) => {
                const category = categories.find(cat => cat.value.toString() === item.value)
                return {
                    label: category?.label || item.label,
                    value: item.value
                }
            })
            setDefaultSelectedCategories(processedDefaults)
        }
    }, [defaultValue, categories])

    const formatedCategories = categories.map((cat) => ({
        label: cat.label,
        value: cat.value.toString(),
        fixed: cat.value === 0
    }))

    // Función de búsqueda para MultipleSelector
    const handleSearch = async (searchTerm: string) => {
        const term = (searchTerm ?? "").trim().toLowerCase()
        if (term.length === 0) return formatedCategories

        return formatedCategories.filter((opt) =>
            opt.label.toLowerCase().includes(term)
        )
    }

    // Detectar y crear categorías nuevas
    const handleChangeNew = async (selectedOptions: { label: string, value: string }[]) => {
        if (!storeId) return

        for (const option of selectedOptions) {
            // Verificar si es una categoría nueva (no existe en las categorías originales)
            const isNewCategory = !categories.some(cat =>
                cat.value.toString() === option.value || cat.label.toLowerCase() === option.label.toLowerCase()
            )

            if (isNewCategory) {
                // Agregar a la lista de categorías en creación
                setCreatingCategories(prev => new Set(prev).add(option.label))

                try {
                    // Crear la nueva categoría
                    const { payload, error } = await createCategoryDynamic(storeId, option.label)
                    if (error) {
                        toast.error(t("error-creating"))
                        continue
                    }

                    // Agregar la nueva categoría al estado local
                    const newCategory = { label: payload.name, value: payload.id }
                    setCategories(prev => [...prev, newCategory])

                    // Actualizar el valor de la opción con el ID real
                    option.value = payload.id.toString()

                    toast.success(t("category-created", { name: payload.name }))
                } catch {
                    toast.error(t("error-creating"))
                } finally {
                    // Remover de la lista de categorías en creación
                    setCreatingCategories(prev => {
                        const newSet = new Set(prev)
                        newSet.delete(option.label)
                        return newSet
                    })
                }
            }
        }

        if (onChange && typeof onChange === "function") {
            onChange(selectedOptions)
        }
    }

    return (
        <div className="flex flex-col gap-1 w-full">
            {withLabel && <Label htmlFor="category">{t("category")}</Label>}
            <MultipleSelector
            delay={100}
                className={cn(className)}
                defaultOptions={formatedCategories}
                value={defaultSelectedCategories}
                placeholder={t("category")}
                creatable
                onSearch={handleSearch}
                triggerSearchOnFocus
                onChange={handleChangeNew}
                loadingIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        {t("searching-categories")}
                    </p>
                }
                emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        {t("no-categories-found")}
                    </p>
                }
            />
            {creatingCategories.size > 0 && (
                <div className="mt-2 space-y-1">
                    {Array.from(creatingCategories).map((categoryName) => (
                        <div key={categoryName} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                            <span>{t("creating-category", { name: categoryName })}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
export default CategorySelect