"use client"

import { Box, Boxes, Check, Copy, Edit2, Plus, Trash2, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"

import { InputField } from "@/features/global/components/form/input-field"
import { TagsField } from "@/features/global/components/form/tags-field"
import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider"
import { CreateProductFormType } from "@/features/products/schemas/create-product-form-schema"
import { Button } from "@/features/shadcn/components/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/features/shadcn/components/ui/accordion"
import { Badge } from "@/features/shadcn/components/ui/badge"
import { Card, CardContent } from "@/features/shadcn/components/ui/card"
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

    // Track which options are currently being edited
    const [editingOptions, setEditingOptions] = useState<Record<string, boolean>>({})

    // Initialize editing state for new options
    useEffect(() => {
        const newEditingState: Record<string, boolean> = { ...editingOptions }
        let changed = false
        options.forEach(opt => {
            // If option is new (empty name/values) and not tracked, mark as editing
            if (opt.id && editingOptions[opt.id] === undefined) {
                // If it has no name/values, assume it's new and should be editable
                const isNew = !opt.name && (!opt.values || opt.values.length === 0)
                newEditingState[opt.id!] = isNew
                changed = true
            }
        })

        if (changed) {
            setEditingOptions(newEditingState)
        }
    }, [options.length]) // Only check when options array length changes or IDs change

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
        const id = generateId()
        const newOptions = [...options, { id, name: "", values: [] }]
        setValue("options_variants_info.options", newOptions)
        setEditingOptions(prev => ({ ...prev, [id]: true }))
    }

    const removeOption = (index: number) => {
        const newOptions = [...options]
        const removedId = newOptions[index].id
        newOptions.splice(index, 1)
        setValue("options_variants_info.options", newOptions)
        setValue("options_variants_info.variants", generateVariants(newOptions))

        if (removedId) {
            setEditingOptions(prev => {
                const newState = { ...prev }
                delete newState[removedId]
                return newState
            })
        }
    }

    const saveOption = (index: number) => {
        const option = options[index]
        // Only save if valid (has name and at least one value)
        if (option.name && option.values && option.values.length > 0) {
            if (option.id) {
                setEditingOptions(prev => ({ ...prev, [option.id!]: false }))
            }
            // Trigger variant generation
            setValue("options_variants_info.variants", generateVariants(options))
        }
    }

    const editOption = (index: number) => {
        const option = options[index]
        if (option.id) {
            setEditingOptions(prev => ({ ...prev, [option.id!]: true }))
        }
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
        // Don't regenerate variants immediately while editing, do it on save
        // Or do we? If we regenerate immediately, variants table updates live. 
        // Let's update live for better UX, but "Save" button just collapses the card.
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
                <p className="text-sm font-medium">Tipo de producto</p>
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
                        <Boxes />
                        <ChoiceBoxLabel>Con Variantes</ChoiceBoxLabel>
                        <ChoiceBoxDescription>Múltiples opciones (color, talle, etc.)</ChoiceBoxDescription>
                    </ChoiceBoxItem>
                </ChoiceBox>
            </div>

            {hasVariants && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300 flex flex-col gap-2">
                    <div className="flex items-end justify-between">
                        <p className="text-sm font-medium">Opciones del Producto</p>
                        {options.length > 0 && (
                            <Button variant="link" onClick={addOption} className="pb-0 relative top-1.5 !pr-0">
                                <Plus /> Agregar opción
                            </Button>
                        )}
                    </div>

                    {options.length === 0 && (
                        <div className="border-2 border-dashed rounded-lg p-8 text-center">
                            <p className="text-muted-foreground">No hay opciones configuradas</p>
                            <Button variant="link" onClick={addOption} className="text-primary">+ Agregar tu primera opción</Button>
                        </div>
                    )}

                    <div className="space-y-4">
                        {options.map((option, index) => {
                            const isEditing = option.id ? editingOptions[option.id] : true

                            if (isEditing) {
                                return (
                                    <Card key={option.id || index}>
                                        <CardContent className="flex flex-col gap-4">
                                            <InputField
                                                name={`options_variants_info.options.${index}.name`}
                                                label="Nombre"
                                                placeholder="Nombre de opción (ej: Color, Talle)"
                                                className="flex-1"
                                                disabled={disabled}
                                                isRequired
                                                tooltip="Es el nombre de la opción que se mostrará como filtro en la tienda."
                                                startIcon={<Box />}
                                            />
                                            <TagsField
                                                label="Valores"
                                                value={option.values?.map(v => v.value) || []}
                                                onChange={(newValues) => updateOptionValues(index, newValues)}
                                                placeholder="Valor (ej: Rojo, XL) - Presiona Enter"
                                                disabled={disabled}
                                                tooltip="Es el valor de la opción que se mostrará como filtro en la tienda."
                                                isRequired
                                                startIcon={<Box />}
                                            />
                                            <div className="flex justify-end gap-2">
                                                <Button variant="destructive" onClick={() => removeOption(index)}>
                                                    <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                                                </Button>
                                                <Button variant="default" onClick={() => saveOption(index)} disabled={disabled || !option.name || !option.values || option.values.length === 0}>
                                                    <Check className="w-4 h-4 mr-2" /> Guardar
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            } else {
                                return (
                                    <div key={option.id || index} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                                        <div className="space-y-1">
                                            <p className="font-medium">{option.name}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {option.values?.map((val, vIndex) => (
                                                    <Badge key={val.id || vIndex} variant="secondary" className="pr-1">
                                                        {val.value}
                                                        <button
                                                            onClick={() => {
                                                                const newValues = option.values!.filter((_, i) => i !== vIndex).map(v => v.value)
                                                                if (newValues.length === 0) {
                                                                    removeOption(index)
                                                                } else {
                                                                    updateOptionValues(index, newValues)
                                                                }
                                                            }}
                                                            className="ml-1 hover:text-destructive focus:outline-none"
                                                            disabled={disabled}
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => editOption(index)} disabled={disabled}>
                                                <Edit2 className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => removeOption(index)} disabled={disabled} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )
                            }
                        })}
                    </div>
                </div>
            )}

            {hasVariants && variants.length > 0 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300 delay-150">
                    <Accordion type="single" collapsible className="w-full" defaultValue="variants">
                        <AccordionItem value="variants" className="border-none">
                            <AccordionTrigger className="hover:no-underline py-2">
                                <div className="flex items-center justify-between w-full mr-4">
                                    <h3 className="text-sm font-medium">Variantes Generadas ({variants.length})</h3>

                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                                <div className="flex flex-col gap-4">
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
                                    <div className="flex justify-end">
                                        <Button variant="outline" onClick={copyPriceToAll} className="gap-2">
                                            <Copy className="h-4 w-4" /> Copiar precio a todas
                                        </Button>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            )}
        </div>
    )
}
