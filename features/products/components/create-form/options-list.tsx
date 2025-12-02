"use client"

import { Plus } from "lucide-react"

import { Button } from "@/features/shadcn/components/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/features/shadcn/components/ui/accordion"
import { OptionType } from "@/features/products/schemas/create-product-form-schema"

import { OptionEditor } from "./option-editor"
import { OptionView } from "./option-view"

interface Option {
    id?: string
    name: string
    type: OptionType
    values?: Array<{ id?: string; value: string }>
}

interface OptionsListProps {
    options: Option[]
    editingOptions: Record<string, boolean>
    disabled?: boolean
    onAddOption: () => void
    onEditOption: (index: number) => void
    onRemoveOption: (index: number) => void
    onSaveOption: (index: number) => void
    onCancelEdit: (index: number, option: Option) => void
    onBackFromEdit: (index: number, option: Option) => void
    onTypeChange: (index: number, type: OptionType) => void
    onValuesChange: (index: number, newValues: string[]) => void
    onRemoveValue: (optionIndex: number, valueIndex: number) => void
}

export function OptionsList({
    options,
    editingOptions,
    disabled,
    onAddOption,
    onEditOption,
    onRemoveOption,
    onSaveOption,
    onCancelEdit,
    onBackFromEdit,
    onTypeChange,
    onValuesChange,
    onRemoveValue,
}: OptionsListProps) {
    const isEditingAnyOption = Object.values(editingOptions).some(v => v)

    return (
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
                                <Button variant="outline" onClick={onAddOption} className="text-primary">+ Agregar tu primera opción</Button>
                            </div>
                        )}

                        <div className="space-y-4">
                            {options.map((option, index) => {
                                const isEditing = option.id ? editingOptions[option.id] : true

                                if (isEditing) {
                                    return (
                                        <OptionEditor
                                            key={option.id || index}
                                            option={option}
                                            index={index}
                                            disabled={disabled}
                                            onBack={() => onBackFromEdit(index, option)}
                                            onCancel={() => onCancelEdit(index, option)}
                                            onSave={() => onSaveOption(index)}
                                            onTypeChange={(type) => onTypeChange(index, type)}
                                            onValuesChange={(newValues) => onValuesChange(index, newValues)}
                                        />
                                    )
                                } else {
                                    // Hide non-editing items when editing any option
                                    if (isEditingAnyOption) return null
                                    return (
                                        <OptionView
                                            key={option.id || index}
                                            option={option}
                                            index={index}
                                            disabled={disabled}
                                            onEdit={() => onEditOption(index)}
                                            onRemove={() => onRemoveOption(index)}
                                            onRemoveValue={(valueIndex) => onRemoveValue(index, valueIndex)}
                                        />
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
                                        onAddOption()
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
    )
}

