"use client"

import { Ruler, EditIcon, X } from "lucide-react"
import { useState } from "react"

import type { DimensionsDisplayProps } from "@/features/products/types"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"


function DimensionsDisplay({ product }: DimensionsDisplayProps) {
    const [isEditing, setIsEditing] = useState(false)

    const handleOpenEdit = () => {
        setIsEditing(true)
    }

    const handleCloseEdit = () => {
        setIsEditing(false)
    }

    function ToggleEditButton() {
        const onClick = () => {
            if (isEditing) {
                handleCloseEdit()
                return
            }
            handleOpenEdit()
        }

        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <IconButton
                        icon={isEditing ? X : EditIcon}
                        onClick={onClick}
                        className="opacity-0 group-hover/dimensions-display:opacity-100 transition-opacity duration-300"
                    />
                </TooltipTrigger>
                <TooltipContent>
                    Editar dimensiones
                </TooltipContent>
            </Tooltip>
        )
    }

    const hasDimensions = product.height || product.width || product.depth || product.diameter || product.weight

    return (
        <Card className="group/dimensions-display">
            <CardHeader>
                <CardTitle>
                    <span className="flex items-center gap-2 text-lg md:text-xl">
                        <Ruler className="size-5" />
                        Dimensiones
                    </span>
                </CardTitle>
                <CardAction>
                    {isEditing && (
                        <button
                            type="button"
                            onClick={handleCloseEdit}
                            className="text-sm bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 rounded-md"
                        >
                            Guardar
                        </button>
                    )}
                    <ToggleEditButton />
                </CardAction>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {!hasDimensions && !isEditing ? (
                        <p className="text-sm text-muted-foreground">No hay dimensiones especificadas</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            {product.height && (
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Altura</label>
                                    <p className="text-sm text-muted-foreground">
                                        {product.height} {product.height_unit}
                                    </p>
                                </div>
                            )}
                            {product.width && (
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Ancho</label>
                                    <p className="text-sm text-muted-foreground">
                                        {product.width} {product.width_unit}
                                    </p>
                                </div>
                            )}
                            {product.depth && (
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Profundidad</label>
                                    <p className="text-sm text-muted-foreground">
                                        {product.depth} {product.depth_unit}
                                    </p>
                                </div>
                            )}
                            {product.diameter && (
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Diámetro</label>
                                    <p className="text-sm text-muted-foreground">
                                        {product.diameter} {product.diameter_unit}
                                    </p>
                                </div>
                            )}
                            {product.weight && (
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Peso</label>
                                    <p className="text-sm text-muted-foreground">
                                        {product.weight} {product.weight_unit}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {isEditing && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Configurar dimensiones</label>
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-4 text-center">
                                <Ruler className="size-8 mx-auto text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">
                                    Especificá las dimensiones del producto
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export { DimensionsDisplay }
