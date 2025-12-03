"use client"

import { ArrowLeft, Box, Boxes, Check } from "lucide-react"

import { InputField } from "@/features/global/components/form/input-field"
import { SelectField } from "@/features/global/components/form/select-field"
import { TagsField } from "@/features/global/components/form/tags-field"
import { OptionType } from "@/features/products/schemas/create-product-form-schema"
import { Button } from "@/features/shadcn/components/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/features/shadcn/components/empty"

interface OptionEditorProps {
    option: {
        id?: string
        name: string
        type: OptionType
        values?: Array<{ id?: string; value: string }>
    }
    index: number
    disabled?: boolean
    onBack: () => void
    onCancel: () => void
    onSave: () => void
    onTypeChange: (type: OptionType) => void
    onValuesChange: (newValues: string[]) => void
}

export function OptionEditor({
    option,
    index,
    disabled,
    onBack,
    onCancel,
    onSave,
    onTypeChange,
    onValuesChange,
}: OptionEditorProps) {
    const isValid = option.name && option.values && option.values.length > 0

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium flex items-center gap-2">
                    <ArrowLeft className="size-4 text-primary cursor-pointer" onClick={onBack} />
                    Editando opción
                </p>
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
                    onChange={(val) => onTypeChange(val as OptionType)}
                    value={option.type || OptionType.TEXT}
                    tooltip="El tipo de opción que se mostrará como filtro en la tienda."
                />
            </div>

            {option.type === OptionType.TEXT ? (
                <TagsField
                    label="Valores"
                    value={option.values?.map(v => v.value) || []}
                    onChange={onValuesChange}
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
                                onClick={() => onTypeChange(OptionType.TEXT)}
                            >
                                Volver a Texto
                            </Button>
                        </EmptyContent>
                    </Empty>
                </div>
            )}

            <div className="flex justify-end gap-2 mt-2">
                <Button variant="ghost" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button variant="default" onClick={onSave} disabled={disabled || !isValid}>
                    <Check className="w-4 h-4 mr-2" /> Guardar
                </Button>
            </div>
        </div>
    )
}

