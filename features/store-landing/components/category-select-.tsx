"use client"
import { useState, useEffect } from "react";
import { getCategories } from "../actions/getCategories";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import MultipleSelector from "@/components/expansion/multiple-selector";
import { searchCategories } from "@/features/categories/data/searchCategories";
import { createCategoryDynamic } from "@/features/categories/actions/createCategoryDynamic";
import { toast } from "sonner";

type CategorySelectProps = {
    onChange?: (value: any) => void
    defaultValue?: any
    withLabel?: boolean
    storeId?: number
}

function CategorySelect({ onChange, defaultValue, withLabel = true, storeId }: CategorySelectProps) {

    const [categories, setCategories] = useState<{ label: string, value: number }[]>([])
    const [creatingCategories, setCreatingCategories] = useState<Set<string>>(new Set())

    const t = useTranslations("subdomain.sidebar.categories");

    useEffect(() => {
        const fetchCategories = async () => {
            const { payload, error } = await getCategories()
            if (error) return console.log(error)
            setCategories(payload.map((cat) => ({ label: cat.name, value: cat.id })))
        }

        fetchCategories()
    }, [])

    const formatedCategories = categories.map((cat) => ({
        label: cat.label,
        value: cat.value.toString(),
        fixed: cat.value === 0
    }))

    // Función de búsqueda para MultipleSelector
    const handleSearch = async (searchTerm: string) => {
        if (!storeId) return []

        try {
            const { payload, error } = await searchCategories(storeId, searchTerm)
            if (error) {
                toast.error(t("error-searching"))
                return []
            }

            return payload.map((cat: any) => ({
                label: cat.name,
                value: cat.id.toString()
            }))
        } catch (error) {
            console.log(error)
            toast.error(t("error-searching"))
            return []
        }
    }

    // Detectar y crear categorías nuevas
    const handleChangeNew = async (selectedOptions: any[]) => {
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
                } catch (error) {
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
                defaultOptions={formatedCategories}
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