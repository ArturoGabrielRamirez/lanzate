"use client"

import { ArrowLeft, Barcode, Box, Boxes, Check, Edit2, Plus, Tag, Trash2, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Separator } from "react-aria-components"
import { useFormContext } from "react-hook-form"

import { InputField } from "@/features/global/components/form/input-field"
import { SelectField } from "@/features/global/components/form/select-field"
import { SwitchField } from "@/features/global/components/form/switch-field"
import { TagsField } from "@/features/global/components/form/tags-field"
import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider"
import { VariantsTable } from "@/features/products/components/create-form/variants-table"
import { CreateProductFormType, OptionType } from "@/features/products/schemas/create-product-form-schema"
import { Button } from "@/features/shadcn/components/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/features/shadcn/components/empty"
import { Item, ItemActions, ItemContent, ItemTitle } from "@/features/shadcn/components/item"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/features/shadcn/components/ui/accordion"
import { Badge } from "@/features/shadcn/components/ui/badge"
import { ChoiceBox, ChoiceBoxDescription, ChoiceBoxItem, ChoiceBoxLabel } from "@/features/shadcn/components/ui/choice-box"
import { cn } from "@/lib/utils"

import type { Selection } from "react-aria-components"

// Simple ID generator
const generateId = () => Math.random().toString(36).substring(2, 9)

export function OptionsVariantsProductPanel() {
    const { watch, setValue, formState: { disabled } } = useFormContext<CreateProductFormType>()
    const { values, setValues: setCtxValues, setStepValid } = useCreateProductContext()
    const { options_variants_info } = values

    const hasVariants = watch("options_variants_info.has_variants")
    const options = watch("options_variants_info.options") || []
    const variants = watch("options_variants_info.variants") || []

    // Price & Stock fields for simple products
    const price = watch("price_stock_info.price")
    const stock = watch("price_stock_info.stock")
    const stockUnlimited = watch("price_stock_info.stock_unlimited")

    // Track which options are currently being edited
    const [editingOptions, setEditingOptions] = useState<Record<string, boolean>>({})

    const isEditingAnyOption = Object.values(editingOptions).some(v => v)

    // Initialize from context
    useEffect(() => {
        if (options_variants_info) {
            // Only set if they differ to avoid unnecessary re-renders, though setValue usually handles this.
            // Force update to ensure RHF matches Context on mount (e.g. coming back from another step)
            setValue("options_variants_info.has_variants", options_variants_info.has_variants)
            setValue("options_variants_info.options", options_variants_info.options || [])
            setValue("options_variants_info.variants", options_variants_info.variants || [])
        }
    }, []) // Run once on mount

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
        } else {
            // For simple products, validate price and stock
            if (price === undefined || price < 0) isValid = false
            if (!stockUnlimited && (stock === undefined || stock < 0)) isValid = false
        }
        setStepValid(3, isValid)
    }, [hasVariants, options, variants, price, stock, stockUnlimited, setStepValid])


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

        setCtxValues({
            ...values,
            options_variants_info: {
                ...values.options_variants_info,
                has_variants: isVariant
            }
        })
    }

    const addOption = () => {
        const id = generateId()
        const newOptions = [...options, { id, name: "", values: [], type: OptionType.TEXT }]
        setValue("options_variants_info.options", newOptions)
        setEditingOptions(prev => ({ ...prev, [id]: true }))

        setCtxValues({
            ...values,
            options_variants_info: {
                ...values.options_variants_info,
                options: newOptions
            }
        })
    }

    const removeOption = (index: number) => {
        const newOptions = [...options]
        const removedId = newOptions[index].id
        newOptions.splice(index, 1)
        const newVariants = generateVariants(newOptions)

        setValue("options_variants_info.options", newOptions)
        setValue("options_variants_info.variants", newVariants)

        setCtxValues({
            ...values,
            options_variants_info: {
                ...values.options_variants_info,
                options: newOptions,
                variants: newVariants
            }
        })

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
            const newVariants = generateVariants(options)
            setValue("options_variants_info.variants", newVariants)

            setCtxValues({
                ...values,
                options_variants_info: {
                    ...values.options_variants_info,
                    variants: newVariants,
                    // options are already updated in their respective handlers, but let's ensure sync just in case
                    options: options
                }
            })
        }
    }

    const editOption = (index: number) => {
        const option = options[index]
        if (option.id) {
            setEditingOptions(prev => ({ ...prev, [option.id!]: true }))
        }
    }

    const updateOptionType = (index: number, type: OptionType) => {
        const newOptions = [...options]
        // If type changes, we might want to clear values or keep them if compatible
        // For now, let's keep them, assuming string values are compatible
        newOptions[index].type = type
        setValue("options_variants_info.options", newOptions)

        setCtxValues({
            ...values,
            options_variants_info: {
                ...values.options_variants_info,
                options: newOptions
            }
        })
    }

    const updateOptionValues = (index: number, newValuesList: string[]) => {
        const newOptions = [...options]
        const currentValues = newOptions[index].values || []
        const newValuesObj = newValuesList.map(v => {
            const existing = currentValues.find(cv => cv.value === v)
            return existing || { id: generateId(), value: v }
        })

        newOptions[index].values = newValuesObj
        setValue("options_variants_info.options", newOptions)

        let newVariants = variants;

        // Only regenerate variants if we are NOT in editing mode (e.g. removing tags from view mode)
        // If we are editing, we wait for the "Save" button
        const optionId = newOptions[index].id
        if (optionId && !editingOptions[optionId]) {
            newVariants = generateVariants(newOptions)
            setValue("options_variants_info.variants", newVariants)
        }

        setCtxValues({
            ...values,
            options_variants_info: {
                ...values.options_variants_info,
                options: newOptions,
                variants: newVariants
            }
        })
    }

    return (
        <div className="flex flex-col gap-4">
            {!isEditingAnyOption && (
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
            )}

            {hasVariants && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300 flex flex-col gap-4">
                    <Accordion type="single" collapsible className="w-full" defaultValue="options">
                        <AccordionItem value="options" className="border-none flex flex-col gap-1">
                            <AccordionTrigger className="hover:no-underline py-0">
                                <p className="text-sm font-medium">Opciones del Producto ({options.length})</p>
                            </AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-2 pb-1">
                                {options.length === 0 && !isEditingAnyOption && (
                                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                        <p className="text-muted-foreground">No hay opciones configuradas</p>
                                        <Button variant="outline" onClick={addOption} className="text-primary">+ Agregar tu primera opción</Button>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {options.map((option, index) => {
                                        const isEditing = option.id ? editingOptions[option.id] : true

                                        if (isEditing) {
                                            return (
                                                <div className="flex flex-col gap-2" key={option.id || index}>
                                                    <div className="flex items-center justify-between mb-2">

                                                        <p className="text-sm font-medium flex items-center gap-2">
                                                            <ArrowLeft className="size-4 text-primary cursor-pointer" onClick={() => {
                                                                if (!option.name && (!option.values || option.values.length === 0)) {
                                                                    removeOption(index)
                                                                } else if (option.id) {
                                                                    // Just stop editing
                                                                    setEditingOptions(prev => ({ ...prev, [option.id!]: false }))
                                                                }
                                                            }} />
                                                            Editando opción
                                                        </p>
                                                        {/* Option to cancel/back could be here too if desired, but user asked for a link generally */}
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                        <SelectField
                                                            name={`options_variants_info.options.${index}.type`}
                                                            label="Tipo"
                                                            isRequired
                                                            placeholder="Tipo"
                                                            options={[
                                                                { value: OptionType.TEXT, label: "Texto", description: "Ej: S, M, L" },
                                                                { value: OptionType.NUMBER, label: "Número", description: "Ej: 28, 30, 32" },
                                                                { value: OptionType.COLOR, label: "Colores", description: "Paleta de colores" },
                                                                { value: OptionType.IMAGE, label: "Imágenes", description: "Texturas/materiales" }
                                                            ]}
                                                            disabled={disabled}
                                                            onChange={(val) => updateOptionType(index, val as OptionType)}
                                                            value={option.type || OptionType.TEXT}
                                                            tooltip="El tipo de opción que se mostrará como filtro en la tienda."
                                                        />
                                                    </div>

                                                    {option.type === OptionType.TEXT ? (
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
                                                    ) : (
                                                        <div className="border rounded-md p-6 bg-muted/20">
                                                            <Empty>
                                                                <EmptyHeader>
                                                                    <EmptyMedia>
                                                                        <Boxes className="w-10 h-10 text-muted-foreground/50" />
                                                                    </EmptyMedia>
                                                                    <EmptyTitle>Próximamente</EmptyTitle>
                                                                    <EmptyDescription>La edición de este tipo de opción estará disponible pronto.</EmptyDescription>
                                                                </EmptyHeader>
                                                                <EmptyContent>
                                                                    <Button
                                                                        variant="outline"
                                                                        onClick={() => updateOptionType(index, OptionType.TEXT)}
                                                                    >
                                                                        Volver a Texto
                                                                    </Button>
                                                                </EmptyContent>
                                                            </Empty>
                                                        </div>
                                                    )}

                                                    <div className="flex justify-end gap-2 mt-2">
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() => {
                                                                // If cancelling a new option (no name/values), remove it
                                                                if (!option.name && (!option.values || option.values.length === 0)) {
                                                                    removeOption(index)
                                                                } else if (option.id) {
                                                                    // Just stop editing
                                                                    setEditingOptions(prev => ({ ...prev, [option.id!]: false }))
                                                                }
                                                            }}
                                                        >
                                                            Cancelar
                                                        </Button>
                                                        {/* <Button variant="destructive" onClick={() => removeOption(index)}>
                                                                <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                                                            </Button> */}
                                                        <Button variant="default" onClick={() => saveOption(index)} disabled={disabled || !option.name || !option.values || option.values.length === 0}>
                                                            <Check className="w-4 h-4 mr-2" /> Guardar
                                                        </Button>
                                                    </div>
                                                </div>
                                            )
                                        } else {
                                            // Hide non-editing items when editing any option
                                            if (isEditingAnyOption) return null
                                            return (
                                                <Item variant="outline" key={option.id || index} size="sm">
                                                    <ItemContent className="flex-1">
                                                        <ItemTitle>{option.name}</ItemTitle>
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
                                                    </ItemContent>
                                                    <ItemActions>
                                                        <Button variant="ghost" size="icon-sm" onClick={() => editOption(index)} disabled={disabled}>
                                                            <Edit2 className="h-4 w-4 text-muted-foreground" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon-sm" onClick={() => removeOption(index)} disabled={disabled} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </ItemActions>
                                                </Item>
                                            )
                                        }
                                    })}
                                </div>
                                <div className="flex justify-end">
                                    {!isEditingAnyOption && options.length > 0 && (
                                        <Button
                                            variant="outline"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                addOption()
                                            }}
                                            size="sm"
                                            className="ml-auto"
                                        >
                                            <Plus /> Agregar opción
                                        </Button>
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            )}

            {!hasVariants && (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            name="price_stock_info.sku"
                            label="SKU"
                            placeholder="SKU-001"
                            startIcon={<Tag />}
                            tooltip="Código único de identificación del producto"
                        />
                        <InputField
                            name="price_stock_info.barcode"
                            label="Código de barras"
                            placeholder="7791234567890"
                            startIcon={<Barcode />}
                            tooltip="Código de barras (EAN, UPC, etc.)"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <InputField
                            name="price_stock_info.price"
                            label="Precio de venta"
                            placeholder="0.00"
                            type="number"
                            startIcon="$"
                            isRequired
                        />
                        <InputField
                            name="price_stock_info.promotional_price"
                            label="Precio promocional"
                            placeholder="0.00"
                            type="number"
                            startIcon="$"
                            tooltip="Si se establece, este será el precio actual"
                        />
                        <InputField
                            name="price_stock_info.cost"
                            label="Costo"
                            placeholder="0.00"
                            type="number"
                            startIcon="$"
                            tooltip="Para cálculo de ganancias (no visible al cliente)"
                        />
                    </div>

                    <div className="flex gap-4 flex-col">
                        <InputField
                            name="price_stock_info.stock"
                            label="Stock disponible"
                            placeholder="0"
                            type="number"
                            disabled={stockUnlimited}
                        />
                        <div className="flex flex-col gap-2">
                            <SwitchField
                                name="price_stock_info.stock_unlimited"
                                label="Stock ilimitado"
                                description="Para productos digitales o servicios"
                            />
                            <Separator />
                            <SwitchField
                                name="price_stock_info.track_stock"
                                label="Rastrear stock"
                                description="Actualizar automáticamente"
                            />
                        </div>
                    </div>
                </div>
            )}

            {hasVariants && variants.length > 0 && !isEditingAnyOption && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300 delay-150">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="variants" className="border-none">
                            <AccordionTrigger className="hover:no-underline py-0">
                                <p className="text-sm font-medium">Variantes Generadas ({variants.length})</p>
                            </AccordionTrigger>
                            <AccordionContent className="pb-1">
                                <VariantsTable />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            )}
        </div>
    )
}
