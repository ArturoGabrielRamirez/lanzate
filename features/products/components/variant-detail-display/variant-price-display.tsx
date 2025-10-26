"use client"

import { DollarSign, EditIcon, X, Check, Loader2 } from "lucide-react"
import { useState } from "react"

import { Form, InputField } from "@/features/layout/components"
import { updateVariantPriceData } from "@/features/products/data/update-variant-price.data"
import type { VariantPriceDisplayProps, VariantPriceFormValues } from "@/features/products/types"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { Label } from "@/features/shadcn/components/ui/label"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"


function VariantPriceDisplay({ variant, productPrice }: VariantPriceDisplayProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [priceInput, setPriceInput] = useState<string>(
        variant.price?.toString() || productPrice.toString()
    )

    const handleOpenEdit = () => {
        setPriceInput(variant.price?.toString() || productPrice.toString())
        setIsEditing(true)
    }

    const handleCloseEdit = () => {
        setIsEditing(false)
    }

    const handleCancel = () => {
        setPriceInput(variant.price?.toString() || productPrice.toString())
        handleCloseEdit()
    }

    const hasCustomPrice = variant.price && variant.price !== productPrice

    return (
        <Card className="group/variant-price-display">
            <Form<VariantPriceFormValues>
                submitButton={false}
                contentButton="Guardar"
                loadingMessage="Guardando..."
                successMessage="Precio actualizado"
                onSuccess={handleCloseEdit}
                formAction={async (data: VariantPriceFormValues) => {
                    try {
                        setIsSaving(true)
                        const raw = data?.["variant-price"]
                        const price = raw && raw !== "" ? Number(raw) : null
                        const response = await updateVariantPriceData(variant.id, { price })
                        setIsSaving(false)
                        return response
                    } catch (error) {
                        setIsSaving(false)
                        throw error
                    }
                }}
            >
                <CardHeader>
                    <CardTitle>
                        <span className="flex items-center gap-2 text-lg md:text-xl">
                            <DollarSign className="size-5" />
                            Precio de la variante
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
                                            className="opacity-0 group-hover/variant-price-display:opacity-100 transition-opacity duration-300"
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
                                            onClick={handleCancel}
                                            color={[161, 161, 170]}
                                            className="opacity-0 group-hover/variant-price-display:opacity-100 transition-opacity duration-300"
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
                                        className="opacity-0 group-hover/variant-price-display:opacity-100 transition-opacity duration-300"
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    Editar precio
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Precio de la variante</Label>
                            <InputField
                                name="variant-price"
                                label="Precio"
                                type="number"
                                defaultValue={priceInput}
                                onChange={(e) => setPriceInput(e.target.value)}
                                disabled={!isEditing}
                                startContent={<span className="text-gray-500">$</span>}
                                placeholder="Ingrese el precio"
                            />
                            {hasCustomPrice && (
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        Precio personalizado
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-muted-foreground/50">
                                <DollarSign className="size-4" />
                                <p className="text-sm">Precio base del producto: ${productPrice}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Form>
        </Card>
    )
}

export { VariantPriceDisplay }
