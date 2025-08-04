"use client"
import CreatableSelect from "react-select/creatable"
import makeAnimated from 'react-select/animated';
import { useState, useEffect } from "react";
import { getCategories } from "../actions/getCategories";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import MultipleSelector from "@/components/expansion/multiple-selector";
import { searchCategories } from "@/features/categories/data/searchCategories";
import { createCategoryDynamic } from "@/features/categories/actions/createCategoryDynamic";

const animatedComponents = makeAnimated();

type CategorySelectProps = {
    onChange?: (value: any) => void
    defaultValue?: any
    withLabel?: boolean
    storeId?: number
}

function CategorySelect({ onChange, defaultValue, withLabel = true, storeId }: CategorySelectProps) {

    const [categories, setCategories] = useState<{ label: string, value: number }[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const t = useTranslations("subdomain.sidebar.categories");

    useEffect(() => {
        const fetchCategories = async () => {
            const { payload, error } = await getCategories()
            if (error) return console.log(error)
            setCategories(payload.map((cat) => ({ label: cat.name, value: cat.id })))
        }

        fetchCategories()
    }, [])

    const handleChange = (value: any) => {
        if (onChange && typeof onChange === "function") onChange(value)
    }

    const formatedCategories = categories.map((cat) => ({
        label: cat.label,
        value: cat.value.toString(),
        fixed: cat.value === 0
    }))

    // Función de búsqueda para MultipleSelector
    const handleSearch = async (searchTerm: string) => {
        if (!storeId) return []
        
        setIsLoading(true)
        try {
            const { payload, error } = await searchCategories(storeId, searchTerm)
            if (error) {
                console.error('Error searching categories:', error)
                return []
            }
            
            return payload.map((cat: any) => ({
                label: cat.name,
                value: cat.id.toString()
            }))
        } catch (error) {
            console.error('Error in search:', error)
            return []
        } finally {
            setIsLoading(false)
        }
    }

    // Detectar y crear categorías nuevas
    const handleChangeNew = async (selectedOptions: any[]) => {
        if (!storeId) return

        const newCategories = []
        
        for (const option of selectedOptions) {
            // Verificar si es una categoría nueva (no existe en las categorías originales)
            const isNewCategory = !categories.some(cat => 
                cat.value.toString() === option.value || cat.label.toLowerCase() === option.label.toLowerCase()
            )
            
            if (isNewCategory) {
                try {
                    // Crear la nueva categoría
                    const { payload, error } = await createCategoryDynamic(storeId, option.label)
                    if (error) {
                        console.error('Error creating category:', error)
                        continue
                    }
                    
                    // Agregar la nueva categoría al estado local
                    const newCategory = { label: payload.name, value: payload.id }
                    setCategories(prev => [...prev, newCategory])
                    
                    // Actualizar el valor de la opción con el ID real
                    option.value = payload.id.toString()
                    
                    console.log('Nueva categoría creada:', payload)
                } catch (error) {
                    console.error('Error creating category:', error)
                }
            }
        }
        
        // Llamar al onChange original con las opciones actualizadas
        if (onChange && typeof onChange === "function") {
            onChange(selectedOptions)
        }
    }

    return (
        <div className="flex flex-col gap-1 w-full">
            {withLabel && <Label htmlFor="category">{t("category")}</Label>}
            {/* <CreatableSelect
                className="w-full"
                classNames={{
                    control: () => "!bg-input/30 !border-input",
                    menu: () => "!bg-background rounded-md overflow-hidden",
                    option: () => "!text-sm hover:!bg-accent",
                    indicatorSeparator: () => "!hidden",
                    dropdownIndicator: () => "!text-muted-foreground",
                }}
                isMulti
                options={categories}
                components={animatedComponents}
                onChange={handleChange}
                defaultValue={defaultValue}
            /> */}
            <MultipleSelector
                defaultOptions={formatedCategories}
                placeholder={t("category")}
                creatable
                onSearch={handleSearch}
                triggerSearchOnFocus
                onChange={handleChangeNew}
                loadingIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        Buscando categorías...
                    </p>
                }
                emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        No se encontraron categorías
                    </p>
                }
            />
        </div>
    )
}
export default CategorySelect