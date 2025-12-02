"use client"

import { useCallback, useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"

import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider"
import { OptionsList } from "@/features/products/components/create-form/options-list"
import { ProductTypeSelector } from "@/features/products/components/create-form/product-type-selector"
import { SimpleProductFields } from "@/features/products/components/create-form/simple-product-fields"
import { generateId, generateVariants } from "@/features/products/components/create-form/utils/option-utils"
import { VariantsAccordion } from "@/features/products/components/create-form/variants-accordion"
import { CreateProductFormType, OptionType } from "@/features/products/schemas/create-product-form-schema"

import type { Selection } from "react-aria-components"

export function OptionsVariantsProductPanel() {
    const { watch, setValue, formState: { disabled }, trigger } = useFormContext<CreateProductFormType>()
    const { values, setValues: setCtxValues, setStepValid } = useCreateProductContext()
    const { options_variants_info, price_stock_info } = values

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
            setValue("options_variants_info.has_variants", options_variants_info.has_variants)
            setValue("options_variants_info.options", options_variants_info.options || [])
            setValue("options_variants_info.variants", options_variants_info.variants || [])
        }
        if (price_stock_info) {
            setValue("price_stock_info.sku", price_stock_info.sku || "")
            setValue("price_stock_info.barcode", price_stock_info.barcode || "")
            setValue("price_stock_info.price", price_stock_info.price || 0)
            setValue("price_stock_info.promotional_price", price_stock_info.promotional_price || null)
            setValue("price_stock_info.cost", price_stock_info.cost || 0)
            setValue("price_stock_info.stock", price_stock_info.stock || 0)
            setValue("price_stock_info.stock_unlimited", price_stock_info.stock_unlimited || false)
            setValue("price_stock_info.track_stock", price_stock_info.track_stock ?? true)
            trigger(["price_stock_info.price", "price_stock_info.stock", "price_stock_info.stock_unlimited"])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // Run once on mount

    // Handlers for price/stock fields to sync with context
    const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) || 0
        setCtxValues({
            ...values,
            price_stock_info: {
                ...values.price_stock_info,
                price: value
            }
        })
        setValue("price_stock_info.price", value, { shouldValidate: true, shouldDirty: true })
    }, [setCtxValues, setValue, values])

    const handlePromotionalPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === "" ? null : (parseFloat(e.target.value) || 0)
        setCtxValues({
            ...values,
            price_stock_info: {
                ...values.price_stock_info,
                promotional_price: value
            }
        })
        setValue("price_stock_info.promotional_price", value, { shouldValidate: true, shouldDirty: true })
    }, [setCtxValues, setValue, values])

    const handleCostChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) || 0
        setCtxValues({
            ...values,
            price_stock_info: {
                ...values.price_stock_info,
                cost: value
            }
        })
        setValue("price_stock_info.cost", value, { shouldValidate: true, shouldDirty: true })
    }, [setCtxValues, setValue, values])

    const handleStockChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) || 0
        setCtxValues({
            ...values,
            price_stock_info: {
                ...values.price_stock_info,
                stock: value
            }
        })
        setValue("price_stock_info.stock", value, { shouldValidate: true, shouldDirty: true })
    }, [setCtxValues, setValue, values])

    const handleSkuChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setCtxValues({
            ...values,
            price_stock_info: {
                ...values.price_stock_info,
                sku: value
            }
        })
        setValue("price_stock_info.sku", value, { shouldValidate: true, shouldDirty: true })
    }, [setCtxValues, setValue, values])

    const handleBarcodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setCtxValues({
            ...values,
            price_stock_info: {
                ...values.price_stock_info,
                barcode: value
            }
        })
        setValue("price_stock_info.barcode", value, { shouldValidate: true, shouldDirty: true })
    }, [setCtxValues, setValue, values])

    const handleStockUnlimitedChange = useCallback((checked: boolean) => {
        setCtxValues({
            ...values,
            price_stock_info: {
                ...values.price_stock_info,
                stock_unlimited: checked
            }
        })
        setValue("price_stock_info.stock_unlimited", checked, { shouldValidate: true, shouldDirty: true })
    }, [setCtxValues, setValue, values])

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
        const newVariants = generateVariants(newOptions, variants as Array<{ id?: string; name?: string; sku?: string; price: number; stock: number }>)

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
            const newVariants = generateVariants(options, variants as Array<{ id?: string; name?: string; sku?: string; price: number; stock: number }>)
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
            newVariants = generateVariants(newOptions, variants as Array<{ id?: string; name?: string; sku?: string; price: number; stock: number }>)
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

    const cancelEdit = (index: number, option: typeof options[0]) => {
        // If cancelling a new option (no name/values), remove it
        if (!option.name && (!option.values || option.values.length === 0)) {
            removeOption(index)
        } else if (option.id) {
            // Just stop editing
            setEditingOptions(prev => ({ ...prev, [option.id!]: false }))
        }
    }

    const backFromEdit = (index: number, option: typeof options[0]) => {
        if (!option.name && (!option.values || option.values.length === 0)) {
            removeOption(index)
        } else if (option.id) {
            // Just stop editing
            setEditingOptions(prev => ({ ...prev, [option.id!]: false }))
        }
    }

    const removeValue = (optionIndex: number, valueIndex: number) => {
        const option = options[optionIndex]
        const newValues = option.values!.filter((_, i) => i !== valueIndex).map(v => v.value)
        if (newValues.length === 0) {
            removeOption(optionIndex)
        } else {
            updateOptionValues(optionIndex, newValues)
        }
    }

    return (
        <div className="flex flex-col gap-4">
            {!isEditingAnyOption && (
                <ProductTypeSelector
                    hasVariants={hasVariants}
                    onSelectionChange={handleTypeSelect}
                    disabled={disabled}
                />
            )}

            {hasVariants && (
                <OptionsList
                    options={options}
                    editingOptions={editingOptions}
                    disabled={disabled}
                    onAddOption={addOption}
                    onEditOption={editOption}
                    onRemoveOption={removeOption}
                    onSaveOption={saveOption}
                    onCancelEdit={cancelEdit}
                    onBackFromEdit={backFromEdit}
                    onTypeChange={updateOptionType}
                    onValuesChange={updateOptionValues}
                    onRemoveValue={removeValue}
                />
            )}

            {!hasVariants && (
                <SimpleProductFields
                    disabled={disabled}
                    stockUnlimited={stockUnlimited}
                    onPriceChange={handlePriceChange}
                    onPromotionalPriceChange={handlePromotionalPriceChange}
                    onCostChange={handleCostChange}
                    onStockChange={handleStockChange}
                    onSkuChange={handleSkuChange}
                    onBarcodeChange={handleBarcodeChange}
                    onStockUnlimitedChange={handleStockUnlimitedChange}
                />
            )}

            {hasVariants && variants.length > 0 && !isEditingAnyOption && (
                <VariantsAccordion variantsCount={variants.length} />
            )}
        </div>
    )
}
