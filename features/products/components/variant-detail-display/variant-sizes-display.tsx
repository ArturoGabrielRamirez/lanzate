"use client"

import { Ruler, EditIcon, X, Check, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { updateVariantSizesData } from "@/features/products/data/update-variant-sizes.data"
import type { VariantSizesDisplayProps } from "@/features/products/types"
import MultipleSelector from "@/features/shadcn/components/expansion/multiple-selector"
import type { Option as MultiOption } from "@/features/shadcn/components/expansion/multiple-selector"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { Label } from "@/features/shadcn/components/ui/label"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"


const sizeOptions: MultiOption[] = [
    { label: "XS", value: "XS", group: "Letras" },
    { label: "S", value: "S", group: "Letras" },
    { label: "M", value: "M", group: "Letras" },
    { label: "L", value: "L", group: "Letras" },
    { label: "XL", value: "XL", group: "Letras" },
    { label: "XXL", value: "XXL", group: "Letras" },
    { label: "36", value: "36", group: "Números" },
    { label: "38", value: "38", group: "Números" },
    { label: "40", value: "40", group: "Números" },
    { label: "42", value: "42", group: "Números" },
    { label: "44", value: "44", group: "Números" },
    { label: "46", value: "46", group: "Números" },
]

const measureOptions: MultiOption[] = [
    { label: "250ml", value: "250ml", group: "Volumen" },
    { label: "500ml", value: "500ml", group: "Volumen" },
    { label: "1L", value: "1L", group: "Volumen" },
    { label: "2L", value: "2L", group: "Volumen" },
    { label: "Pequeño", value: "small", group: "Genérico" },
    { label: "Mediano", value: "medium", group: "Genérico" },
    { label: "Grande", value: "large", group: "Genérico" },
]

function VariantSizesDisplay({ variant }: VariantSizesDisplayProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [selectedSize, setSelectedSize] = useState<MultiOption | null>(
        variant.size ? { label: variant.size, value: variant.size, group: "Custom" } : null
    )
    const [selectedMeasure, setSelectedMeasure] = useState<MultiOption | null>(
        variant.measure ? { label: variant.measure, value: variant.measure, group: "Custom" } : null
    )

    const handleOpenEdit = () => {
        setIsEditing(true)
    }

    const handleCloseEdit = () => {
        setIsEditing(false)
    }

    const handleChangeSize = (options: MultiOption[]) => {
        const selected = options[0] || null
        setSelectedSize(selected)
    }

    const handleChangeMeasure = (options: MultiOption[]) => {
        const selected = options[0] || null
        setSelectedMeasure(selected)
    }

    return (
        <Card className="group/variant-sizes-display">
            <form
                onSubmit={async (e) => {
                    e.preventDefault()
                    setIsSaving(true)
                    const response = await updateVariantSizesData(variant.id, {
                        size: selectedSize?.value ?? null,
                        measure: selectedMeasure?.value ?? null
                    })
                    if (response.hasError) {
                        toast.error(response.message || "Error al actualizar los tamaños")
                        setIsSaving(false)
                        return
                    }
                    toast.success(response.message || "Tamaños actualizados correctamente")
                    handleCloseEdit()
                    setIsSaving(false)
                }}
            >
                <CardHeader>
                    <CardTitle>
                        <span className="flex items-center gap-2 text-lg md:text-xl">
                            <Ruler className="size-5" />
                            Tamaños y talles
                        </span>
                    </CardTitle>
                    <CardAction>
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <IconButton
                                            icon={isSaving ? Loader2 : Check}
                                            iconClassName={isSaving ? "animate-spin" : undefined}
                                            type="submit"
                                            color={[99, 102, 241]}
                                            className="opacity-0 group-hover/variant-sizes-display:opacity-100 transition-opacity duration-300"
                                            disabled={isSaving}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Guardar cambios
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <IconButton
                                            icon={X}
                                            onClick={handleCloseEdit}
                                            color={[161, 161, 170]}
                                            className="opacity-0 group-hover/variant-sizes-display:opacity-100 transition-opacity duration-300"
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Cancelar edición
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        ) : (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <IconButton
                                        icon={EditIcon}
                                        onClick={handleOpenEdit}
                                        color={[161, 161, 170]}
                                        className="opacity-0 group-hover/variant-sizes-display:opacity-100 transition-opacity duration-300"
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    Editar tamaños
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <Label>Talles (letras y números)</Label>
                            <MultipleSelector
                                className="w-full"
                                defaultOptions={sizeOptions}
                                value={selectedSize ? [selectedSize] : []}
                                onChange={handleChangeSize}
                                placeholder="Selecciona o crea talle"
                                creatable
                                groupBy="group"
                                disabled={!isEditing}
                                hidePlaceholderWhenSelected
                            />
                        </div>

                        <div className="space-y-3">
                            <Label>Tamaños (volúmenes o genéricos)</Label>
                            <MultipleSelector
                                className="w-full"
                                defaultOptions={measureOptions}
                                value={selectedMeasure ? [selectedMeasure] : []}
                                onChange={handleChangeMeasure}
                                placeholder="Selecciona o crea tamaño"
                                creatable
                                groupBy="group"
                                disabled={!isEditing}
                                hidePlaceholderWhenSelected
                            />
                        </div>
                    </div>
                </CardContent>
            </form>
        </Card>
    )
}

export { VariantSizesDisplay }
