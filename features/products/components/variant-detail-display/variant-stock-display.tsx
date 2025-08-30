"use client"

import { Package, EditIcon, X, Check } from "lucide-react"
import { ProductVariant } from "@prisma/client"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, InputField } from "@/features/layout/components"
import { useState } from "react"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { yupResolver } from "@hookform/resolvers/yup"
import { useFormContext } from "react-hook-form"
import { editVariantSchema } from "../../schemas/product-schema"

interface VariantStockDisplayProps {
    variant: ProductVariant & {
        stocks?: { quantity: number; branch_id: number }[]
    }
}

type VariantStockFormValues = {
    stock: number
}

const VariantStockDisplay = ({ variant }: VariantStockDisplayProps) => {
    const [isEditing, setIsEditing] = useState(false)

    const handleOpenEdit = () => {
        setIsEditing(true)
    }

    const handleCloseEdit = () => {
        setIsEditing(false)
    }

    function ToggleEditButton() {
        const { reset } = useFormContext<VariantStockFormValues>()

        const totalStock = (variant.stocks ?? []).reduce((sum, stock) => sum + stock.quantity, 0)

        const initialValues = {
            stock: totalStock,
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
                        className="opacity-0 group-hover/variant-stock-display:opacity-100 transition-opacity duration-300"
                    />
                </TooltipTrigger>
                <TooltipContent>
                    Editar stock de la variante
                </TooltipContent>
            </Tooltip>
        )
    }

    const totalStock = (variant.stocks ?? []).reduce((sum, stock) => sum + stock.quantity, 0)

    return (
        <Card className="group/variant-stock-display">
            <Form
                submitButton={false}
                contentButton={false}
                resolver={yupResolver(editVariantSchema)}
                onSuccess={handleCloseEdit}
                defaultValues={{
                    stock: totalStock,
                }}
            >
                <CardHeader>
                    <CardTitle>
                        <span className="flex items-center gap-2 text-lg md:text-xl">
                            <Package className="size-5" />
                            Stock de la variante
                        </span>
                    </CardTitle>
                    <CardAction>
                        {isEditing && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <IconButton
                                        icon={Check}
                                        type="submit"
                                        color={[99, 102, 241]}
                                        className="opacity-0 group-hover/variant-stock-display:opacity-100 transition-opacity duration-300"
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    Guardar cambios
                                </TooltipContent>
                            </Tooltip>
                        )}
                        <ToggleEditButton />
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Stock total</label>
                            {isEditing ? (
                                <InputField name="stock" type="number" label="Stock" />
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Package className="size-4 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">{totalStock} unidades</p>
                                </div>
                            )}
                        </div>
                        
                        {variant.stocks && variant.stocks.length > 0 && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Stock por sucursal</label>
                                <div className="space-y-2">
                                    {variant.stocks.map((stock, index) => (
                                        <div key={index} className="flex justify-between items-center p-2 bg-muted rounded-md">
                                            <span className="text-sm text-foreground">Sucursal {stock.branch_id}</span>
                                            <span className="text-sm font-medium text-foreground">{stock.quantity} unidades</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Form>
        </Card>
    )
}

export default VariantStockDisplay
