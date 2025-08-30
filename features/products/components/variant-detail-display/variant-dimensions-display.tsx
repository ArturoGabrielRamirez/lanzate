"use client"

import { Scale, EditIcon, X, Check } from "lucide-react"
import { ProductVariant } from "@prisma/client"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, InputField } from "@/features/layout/components"
import { useState } from "react"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { yupResolver } from "@hookform/resolvers/yup"
import { editVariantSchema } from "../../schemas/product-schema"

interface VariantDimensionsDisplayProps {
    variant: ProductVariant
    product: any
}

const VariantDimensionsDisplay = ({ variant, product }: VariantDimensionsDisplayProps) => {
    const [isEditing, setIsEditing] = useState(false)

    const handleOpenEdit = () => {
        setIsEditing(true)
    }

    const handleCloseEdit = () => {
        setIsEditing(false)
    }

    return (
        <Card className="group/variant-dimensions-display">
            <Form
                submitButton={false}
                contentButton={false}
                resolver={yupResolver(editVariantSchema)}
                onSuccess={handleCloseEdit}
            >
                <CardHeader>
                    <CardTitle>
                        <span className="flex items-center gap-2 text-lg md:text-xl">
                            <Scale className="size-5" />
                            Dimensiones y peso
                        </span>
                    </CardTitle>
                    <CardAction>
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <IconButton
                                            icon={Check}
                                            type="submit"
                                            color={[99, 102, 241]}
                                            className="opacity-0 group-hover/variant-dimensions-display:opacity-100 transition-opacity duration-300"
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
                                            className="opacity-0 group-hover/variant-dimensions-display:opacity-100 transition-opacity duration-300"
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
                                        className="opacity-0 group-hover/variant-dimensions-display:opacity-100 transition-opacity duration-300"
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    Editar dimensiones
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <InputField
                                name="weight"
                                label="Peso (kg)"
                                type="number"
                                step="0.01"
                                defaultValue={variant.weight?.toString() || product.weight?.toString()}
                                placeholder="Ej. 0.5"
                                disabled={!isEditing}
                            />
                            <p className="text-xs text-muted-foreground/50">
                                Peso base del producto: {product.weight || "No especificado"}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <InputField
                                name="height"
                                label="Alto (cm)"
                                type="number"
                                step="0.1"
                                defaultValue={variant.height?.toString() || product.height?.toString()}
                                placeholder="Ej. 10"
                                disabled={!isEditing}
                            />
                            <p className="text-xs text-muted-foreground/50">
                                Alto base del producto: {product.height || "No especificado"}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <InputField
                                name="width"
                                label="Ancho (cm)"
                                type="number"
                                step="0.1"
                                defaultValue={variant.width?.toString() || product.width?.toString()}
                                placeholder="Ej. 15"
                                disabled={!isEditing}
                            />
                            <p className="text-xs text-muted-foreground/50">
                                Ancho base del producto: {product.width || "No especificado"}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <InputField
                                name="length"
                                label="Largo (cm)"
                                type="number"
                                step="0.1"
                                defaultValue={variant.length?.toString() || product.length?.toString()}
                                placeholder="Ej. 20"
                                disabled={!isEditing}
                            />
                            <p className="text-xs text-muted-foreground/50">
                                Largo base del producto: {product.length || "No especificado"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Form>
        </Card>
    )
}

export default VariantDimensionsDisplay
