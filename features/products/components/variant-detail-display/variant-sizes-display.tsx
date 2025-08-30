"use client"

import { Ruler, EditIcon, X, Check } from "lucide-react"
import { ProductVariant } from "@prisma/client"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, InputField } from "@/features/layout/components"
import { useState } from "react"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { yupResolver } from "@hookform/resolvers/yup"
import { editVariantSchema } from "../../schemas/product-schema"

interface VariantSizesDisplayProps {
    variant: ProductVariant
    product: any
}

const VariantSizesDisplay = ({ variant, product }: VariantSizesDisplayProps) => {
    const [isEditing, setIsEditing] = useState(false)

    const handleOpenEdit = () => {
        setIsEditing(true)
    }

    const handleCloseEdit = () => {
        setIsEditing(false)
    }

    return (
        <Card className="group/variant-sizes-display">
            <Form
                submitButton={false}
                contentButton={false}
                resolver={yupResolver(editVariantSchema)}
                onSuccess={handleCloseEdit}
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
                                            icon={Check}
                                            type="submit"
                                            color={[99, 102, 241]}
                                            className="opacity-0 group-hover/variant-sizes-display:opacity-100 transition-opacity duration-300"
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <InputField
                                name="size_or_measure"
                                label="Talle o medida"
                                defaultValue={variant.size || ""}
                                placeholder="Ej. M, L, XL"
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="space-y-1">
                            <InputField
                                name="size"
                                label="Tamaño"
                                defaultValue={variant.size || ""}
                                placeholder="Ej. 42, 44, 46"
                                disabled={!isEditing}
                            />
                            <p className="text-xs text-muted-foreground/50">
                                Tamaño base del producto: {product.size || "No especificado"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Form>
        </Card>
    )
}

export default VariantSizesDisplay
