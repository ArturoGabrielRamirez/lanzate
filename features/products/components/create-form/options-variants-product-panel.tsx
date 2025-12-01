"use client"

import { Box, Copy, Layers, Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"

import { TagsValue } from "@/components/ui/shadcn-io/tags"
import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider"
import { CreateProductFormType } from "@/features/products/schemas/create-product-form-schema"
import { Button } from "@/features/shadcn/components/ui/button"
import { ChoiceBox, ChoiceBoxDescription, ChoiceBoxItem, ChoiceBoxLabel } from "@/features/shadcn/components/ui/choice-box"
import { Input } from "@/features/shadcn/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/features/shadcn/components/ui/table"
import { cn } from "@/lib/utils"

import type { Selection } from "react-aria-components"

// Simple ID generator
const generateId = () => Math.random().toString(36).substring(2, 9)

export function OptionsVariantsProductPanel() {
    const { watch, setValue, formState: { disabled } } = useFormContext<CreateProductFormType>()
    const { setStepValid } = useCreateProductContext()

    const hasVariants = watch("options_variants_info.has_variants")
    const options = watch("options_variants_info.options") || []
    const variants = watch("options_variants_info.variants") || []

    // Update step validity
    useEffect(() => {
        let isValid = true
        if (hasVariants) {
            if (options.length === 0) isValid = false
            // Check if all options have names and at least one value
            const optionsValid = options.every(opt => opt.name && opt.values && opt.values.length > 0)
            if (!optionsValid) isValid = false
            // Check if variants exist (they should if options exist)
            if (variants.length === 0) isValid = false
        }
        setStepValid(3, isValid)
    }, [/* hasVariants, options, variants, setStepValid */])


    // Generate Variants based on Options
    const generateVariants = (currentOptions: typeof options) => {
        if (currentOptions.length === 0) return []

        const validOptions = currentOptions.filter(opt => opt.name && opt.values && opt.values.length > 0)
        if (validOptions.length === 0) return []

        const optionValuesArrays = validOptions.map(opt => opt.values!.map(v => ({
            optionName: opt.name,
            value: v.value
        })))

        // Cartesian product helper
        const cartesianProduct = <T,>(arrays: T[][]): T[][] => {
            return arrays.reduce<T[][]>((acc, curr) => {
                return acc.flatMap(x => curr.map(y => [...x, y]));
            }, [[]] as T[][]);
        }

        const combinations = cartesianProduct(optionValuesArrays)

        return combinations.map((combo) => {
            const name = combo.map(c => c.value).join(" / ")
            // Preserve existing variant data if name matches
            const existing = variants.find(v => v.name === name)
            return {
                id: existing?.id || generateId(),
                name,
                sku: existing?.sku || "",
                price: existing?.price || 0,
                stock: existing?.stock || 0
            }
        })
    }

    const handleTypeSelect = (selection: Selection) => {
        if (selection === "all") return
        const selected = Array.from(selection)[0]
        const isVariant = selected === "variants"
        setValue("options_variants_info.has_variants", isVariant)
    }

    const addOption = () => {
        const newOptions = [...options, { id: generateId(), name: "", values: [] }]
        setValue("options_variants_info.options", newOptions)
    }

    const removeOption = (index: number) => {
        const newOptions = [...options]
        newOptions.splice(index, 1)
        setValue("options_variants_info.options", newOptions)
        setValue("options_variants_info.variants", generateVariants(newOptions))
    }

    const updateOptionName = (index: number, name: string) => {
        const newOptions = [...options]
        newOptions[index].name = name
        setValue("options_variants_info.options", newOptions)
        // We don't regenerate variants here because variant names depend on values, 
        // but if we wanted to include option name in variant name (e.g. Color: Red), we would need to.
        // Currently using "Red / Small" format.
    }

    const updateOptionValues = (index: number, values: string[]) => {
        const newOptions = [...options]
        const currentValues = newOptions[index].values || []
        const newValuesObj = values.map(v => {
            const existing = currentValues.find(cv => cv.value === v)
            return existing || { id: generateId(), value: v }
        })

        newOptions[index].values = newValuesObj
        setValue("options_variants_info.options", newOptions)
        setValue("options_variants_info.variants", generateVariants(newOptions))
    }

    const updateVariant = (index: number, field: string, value: string | number) => {
        const newVariants = [...variants]
        // @ts-expect-error - dynamic field access
        newVariants[index][field] = value
        setValue("options_variants_info.variants", newVariants)
    }

    const copyPriceToAll = () => {
        if (variants.length === 0) return
        const price = variants[0].price
        const newVariants = variants.map(v => ({ ...v, price }))
        setValue("options_variants_info.variants", newVariants)
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="space-y-2">
                <h3 className="text-sm font-medium">¿Este producto tiene variantes?</h3>
                <ChoiceBox
                    columns={2}
                    gap={4}
                    selectionMode="single"
                    selectedKeys={[hasVariants ? "variants" : "simple"]}
                    onSelectionChange={handleTypeSelect}
                    className={cn(disabled && "pointer-events-none")}
                    defaultSelectedKeys={hasVariants ? ["variants"] : ["simple"]}
                >
                    <ChoiceBoxItem id="simple" textValue="Producto Simple">
                        <Box />
                        <ChoiceBoxLabel>Producto Simple</ChoiceBoxLabel>
                        <ChoiceBoxDescription>Un solo SKU, sin variaciones.</ChoiceBoxDescription>
                    </ChoiceBoxItem>
                    <ChoiceBoxItem id="variants" textValue="Con Variantes">
                        <Layers />
                        <ChoiceBoxLabel>Con Variantes</ChoiceBoxLabel>
                        <ChoiceBoxDescription>Múltiples opciones (color, talle, etc.)</ChoiceBoxDescription>
                    </ChoiceBoxItem>
                </ChoiceBox>
            </div>

            {hasVariants && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">Opciones del Producto</h3>
                        <Button variant="outline" size="sm" onClick={addOption} className="gap-2 text-primary hover:text-primary hover:bg-primary/5">
                            <Plus className="h-4 w-4" /> Agregar opción
                        </Button>
                    </div>

                    {options.length === 0 && (
                        <div className="border-2 border-dashed rounded-lg p-8 text-center">
                            <p className="text-muted-foreground">No hay opciones configuradas</p>
                            <Button variant="link" onClick={addOption} className="text-primary">+ Agregar tu primera opción</Button>
                        </div>
                    )}

                    <div className="space-y-4">
                        {options.map((option, index) => (
                            <div key={option.id} className="border rounded-lg p-4 space-y-4 bg-card">
                                <div className="flex gap-4 items-start">
                                    <div className="mt-3 cursor-grab text-muted-foreground">
                                        <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 14C4 15.1 3.1 16 2 16C0.9 16 0 15.1 0 14C0 12.9 0.9 12 2 12C3.1 12 4 12.9 4 14ZM2 6C0.9 6 0 6.9 0 8C0 9.1 0.9 10 2 10C3.1 10 4 9.1 4 8C4 6.9 3.1 6 2 6ZM2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0ZM8 0C6.9 0 6 0.9 6 2C6 3.1 6.9 4 8 4C9.1 4 10 3.1 10 2C10 0.9 9.1 0 8 0ZM8 6C6.9 6 6 6.9 6 8C6 9.1 6.9 10 8 10C9.1 10 10 9.1 10 8C10 6.9 9.1 6 8 6ZM8 12C6.9 12 6 12.9 6 14C6 15.1 6.9 16 8 16C9.1 16 10 15.1 10 14C10 12.9 9.1 12 8 12Z" fillOpacity="0.4" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Nombre de opción (ej: Color, Talle)"
                                                value={option.name}
                                                onChange={(e) => updateOptionName(index, e.target.value)}
                                                className="flex-1"
                                            />
                                            <Button variant="ghost" size="icon" onClick={() => removeOption(index)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div>
                                            <SimpleTagInput
                                                values={option.values?.map(v => v.value) || []}
                                                onChange={(newValues) => updateOptionValues(index, newValues)}
                                                placeholder="Valor (ej: Rojo, XL) - Presiona Enter"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {hasVariants && variants.length > 0 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300 delay-150">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">Variantes Generadas ({variants.length})</h3>
                        <Button variant="ghost" size="sm" onClick={copyPriceToAll} className="gap-2">
                            <Copy className="h-4 w-4" /> Copiar precio a todas
                        </Button>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Variante</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Precio</TableHead>
                                    <TableHead>Stock</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {variants.map((variant, index) => (
                                    <TableRow key={variant.id}>
                                        <TableCell className="font-medium">
                                            <span className="bg-muted px-2 py-1 rounded text-xs">{variant.name}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                value={variant.sku || ""}
                                                onChange={(e) => updateVariant(index, "sku", e.target.value)}
                                                className="h-8 w-32"
                                                placeholder="SKU"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                value={variant.price}
                                                onChange={(e) => updateVariant(index, "price", parseFloat(e.target.value) || 0)}
                                                className="h-8 w-24"
                                                min={0}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                value={variant.stock}
                                                onChange={(e) => updateVariant(index, "stock", parseFloat(e.target.value) || 0)}
                                                className="h-8 w-24"
                                                min={0}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}
        </div>
    )
}

function SimpleTagInput({ values, onChange, placeholder }: { values: string[], onChange: (v: string[]) => void, placeholder: string }) {
    const [inputValue, setInputValue] = useState("")

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue.trim()) {
            e.preventDefault()
            if (!values.includes(inputValue.trim())) {
                onChange([...values, inputValue.trim()])
            }
            setInputValue("")
        }
    }

    const removeTag = (tag: string) => {
        onChange(values.filter(v => v !== tag))
    }

    return (
        <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-background focus-within:ring-1 focus-within:ring-ring">
            {values.map(tag => (
                <TagsValue key={tag} onRemove={() => removeTag(tag)}>
                    {tag}
                </TagsValue>
            ))}
            <input
                placeholder={values.length === 0 ? placeholder : ""}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 min-w-[120px] border-none focus:outline-none p-0 h-9 bg-transparent text-sm"
            />
        </div>
    )
}
