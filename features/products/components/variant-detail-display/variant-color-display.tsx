"use client"

import { Product, ProductVariant } from "@prisma/client"
import { Palette, EditIcon, X, Check, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Form } from "@/features/layout/components"
import { CreateColorInline } from "@/features/products/components/create-color-inline"
import { updateVariantColorData } from "@/features/products/data/update-variant-color.data"
import { ProductColor } from "@/features/products/types/product-color"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"

interface VariantColorDisplayProps {
    variant: ProductVariant & {
        color?: { name: string; hex: string } | null
    }
    product: Product & {
        available_colors: ProductColor[]
    }
}

function VariantColorDisplay({ variant, product }: VariantColorDisplayProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [pendingColorId, setPendingColorId] = useState<number | null>(variant.color ? (variant).color_id ?? null : null)

    const handleOpenEdit = () => {
        setIsEditing(true)
    }

    const handleCloseEdit = () => {
        setIsEditing(false)
    }

    return (
        <Card className="group/variant-color-display">
            <Form submitButton={false} contentButton={false}>
                <CardHeader>
                    <CardTitle>
                        <span className="flex items-center gap-2 text-lg md:text-xl">
                            <Palette className="size-5" />
                            Color
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
                                            onClick={async () => {
                                                try {
                                                    setIsSaving(true)
                                                    const { hasError, message } = await updateVariantColorData(variant.id, pendingColorId)
                                                    if (hasError) {
                                                        toast.error(message || "Error al actualizar color")
                                                        setIsSaving(false)
                                                        return
                                                    }
                                                    toast.success("Color actualizado")
                                                    handleCloseEdit()
                                                    setIsSaving(false)
                                                } catch {
                                                    toast.error("Error al actualizar color")
                                                }
                                            }}
                                            color={[99, 102, 241]}
                                            className="opacity-0 group-hover/variant-color-display:opacity-100 transition-opacity duration-300"
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
                                            className="opacity-0 group-hover/variant-color-display:opacity-100 transition-opacity duration-300"
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
                                        className="opacity-0 group-hover/variant-color-display:opacity-100 transition-opacity duration-300"
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    Editar color
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {variant.color ? (
                            <div className="flex items-center gap-3">
                                <div
                                    className="size-10 rounded-full border"
                                    style={{ backgroundColor: variant.color.hex }}
                                />
                                <div>
                                    <p className="font-medium">{variant.color.name}</p>
                                    <p className="text-sm text-muted-foreground">{variant.color.hex}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground">
                                No se ha asignado un color a esta variante
                            </div>
                        )}

                        {isEditing && (
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                    {product.available_colors?.map((color: ProductColor) => {
                                        const isSelected = (pendingColorId ?? variant.color_id) === Number(color.id)
                                        return (
                                            <button
                                                key={color.id}
                                                type="button"
                                                className={`p-2 rounded-lg border text-left transition-colors ${isSelected ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                                                    }`}
                                                onClick={() => setPendingColorId(Number(color.id))}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="size-6 rounded-full border" style={{ backgroundColor: `rgba(${color.rgba[0]}, ${color.rgba[1]}, ${color.rgba[2]}, ${color.rgba[3]})` }} />
                                                    <span className="text-sm">{color.name}</span>
                                                </div>
                                            </button>
                                        )
                                    })}
                                    <button
                                        type="button"
                                        className={`p-2 rounded-lg border text-left transition-colors ${pendingColorId === null ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                                            }`}
                                        onClick={() => setPendingColorId(null)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="size-6 rounded-full border bg-background" />
                                            <span className="text-sm">Sin color</span>
                                        </div>
                                    </button>
                                </div>
                                <CreateColorInline onCreated={(newColor) => {
                                    /* product.available_colors = [...(product.available_colors ?? []), newColor] */
                                    setPendingColorId(newColor.id)
                                }} />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Form>
        </Card>
    )
}

export { VariantColorDisplay }
