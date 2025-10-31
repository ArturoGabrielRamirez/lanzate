"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { DollarSign, Package, EditIcon, X } from "lucide-react"
import { useState } from "react"
import { useFormContext } from "react-hook-form"

import { Form } from "@/features/global/components/form/form"
import InputField from "@/features/global/components/form/input"
import { editProductSchema } from "@/features/products/schemas/product-schema"
import type { PriceStockDisplayProps, PriceStockFormValues } from "@/features/products/types"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"

function PriceStockDisplay({ product }: PriceStockDisplayProps) {
    const [isEditing, setIsEditing] = useState(false)

    const handleOpenEdit = () => {
        setIsEditing(true)
    }

    const handleCloseEdit = () => {
        setIsEditing(false)
    }

    function ToggleEditButton() {
        const { reset } = useFormContext<PriceStockFormValues>()

        const initialValues = {
            price: product.price,
            stock: product.stock,
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
                        className="opacity-0 group-hover/price-stock-display:opacity-100 transition-opacity duration-300"
                    />
                </TooltipTrigger>
                <TooltipContent>
                    Editar precio y stock
                </TooltipContent>
            </Tooltip>
        )
    }

    return (
        <Card className="group/price-stock-display">
            <Form
                submitButton={false}
                contentButton={false}
                resolver={yupResolver(editProductSchema as never)}
                onSuccess={handleCloseEdit}
            >
                <CardHeader>
                    <CardTitle>
                        <span className="flex items-center gap-2 text-lg md:text-xl">
                            <DollarSign className="size-5" />
                            Precio y stock
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Precio</label>
                            {isEditing ? (
                                <InputField name="price" type="number" label="Precio" />
                            ) : (
                                <p className="text-sm text-muted-foreground">${product.price}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Stock total</label>
                            {isEditing ? (
                                <InputField name="stock" type="number" label="Stock total" />
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Package className="size-4 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">{product.stock} unidades</p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Form>
        </Card>
    )
}

export { PriceStockDisplay }
