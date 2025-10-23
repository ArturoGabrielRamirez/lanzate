"use client"

import { Boxes, EditIcon, X } from "lucide-react"
import { useState } from "react"

import { DeleteVariantButton } from "@/features/products/components/delete-variant-button"
import type { VariantsDisplayProps } from "@/features/products/types"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"


function VariantsDisplay({ product, slug }: VariantsDisplayProps) {
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
                        className="opacity-0 group-hover/variants-display:opacity-100 transition-opacity duration-300"
                    />
                </TooltipTrigger>
                <TooltipContent>
                    Editar variantes
                </TooltipContent>
            </Tooltip>
        )
    }

    return (
        <Card className="group/variants-display">
            <CardHeader>
                <CardTitle>
                    <span className="flex items-center gap-2 text-lg md:text-xl">
                        <Boxes className="size-5" />
                        Variantes
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
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Variantes del producto</label>
                        {product.variants.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No hay variantes configuradas</p>
                        ) : (
                            <div className="grid gap-2 sm:grid-cols-2">
                                {product.variants.map((variant) => {
                                    const total = (variant.stocks ?? []).reduce((s: number, x: { quantity: number }) => s + (x.quantity ?? 0), 0)
                                    const label = [variant.size, variant.color?.name].filter(Boolean).join(" · ") || `Variante ${variant.id}`
                                    
                                    return (
                                        <div key={variant.id} className="rounded-md border p-3 flex items-center gap-3">
                                            {variant.primary_media?.url ? (
                                                <img 
                                                    src={variant.primary_media.url} 
                                                    alt={label} 
                                                    className="h-12 w-12 rounded object-cover" 
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded bg-secondary flex items-center justify-center">
                                                    <Boxes className="size-6 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div className="flex flex-col flex-1">
                                                <span className="text-sm font-medium">{label}</span>
                                                <span className="text-xs text-muted-foreground">Stock: {total}</span>
                                                {variant.price && variant.price !== product.price && (
                                                    <span className="text-xs text-muted-foreground">Precio: ${variant.price}</span>
                                                )}
                                            </div>
                                            {isEditing && (
                                                <DeleteVariantButton
                                                    variantId={variant.id}
                                                    slug={slug}
                                                    productId={product.id}
                                                />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                    
                    {isEditing && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Agregar nueva variante</label>
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-4 text-center">
                                <Boxes className="size-8 mx-auto text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">
                                    Configura nuevas variantes para este producto
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export { VariantsDisplay }
