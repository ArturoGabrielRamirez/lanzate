"use client"

import { DollarSign, EditIcon, X } from "lucide-react"
import { ProductVariant } from "@prisma/client"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, InputField } from "@/features/layout/components"
import { useState } from "react"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { yupResolver } from "@hookform/resolvers/yup"
import { useFormContext } from "react-hook-form"
import { editVariantSchema } from "../../schemas/product-schema"

interface VariantPriceDisplayProps {
    variant: ProductVariant
    productPrice: number
}

type VariantPriceFormValues = {
    price: number
}

const VariantPriceDisplay = ({ variant, productPrice }: VariantPriceDisplayProps) => {
    const [isEditing, setIsEditing] = useState(false)

    const handleOpenEdit = () => {
        setIsEditing(true)
    }

    const handleCloseEdit = () => {
        setIsEditing(false)
    }

    function ToggleEditButton() {
        const { reset } = useFormContext<VariantPriceFormValues>()

        const initialValues = {
            price: variant.price || productPrice,
        }

        const onClick = () => {
            if (isEditing) {
                reset(initialValues)
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
                        className="opacity-0 group-hover/variant-price-display:opacity-100 transition-opacity duration-300"
                    />
                </TooltipTrigger>
                <TooltipContent>
                    Editar precio de la variante
                </TooltipContent>
            </Tooltip>
        )
    }

    const variantPrice = variant.price || productPrice
    const hasCustomPrice = variant.price && variant.price !== productPrice

    return (
        <Card className="group/variant-price-display">
            <Form
                submitButton={false}
                contentButton={false}
                resolver={yupResolver(editVariantSchema)}
                onSuccess={handleCloseEdit}
                defaultValues={{
                    price: variant.price || productPrice,
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
                        {isEditing && (
                            <button
                                type="submit"
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
                            <label className="text-sm font-medium">Precio de la variante</label>
                            {isEditing ? (
                                <InputField name="price" type="number" label="Precio" />
                            ) : (
                                <div className="flex items-center gap-2">
                                    <DollarSign className="size-4 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">${variantPrice}</p>
                                    {hasCustomPrice && (
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                            Precio personalizado
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        {hasCustomPrice && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Precio del producto base</label>
                                <p className="text-sm text-muted-foreground">${productPrice}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Form>
        </Card>
    )
}

export default VariantPriceDisplay
