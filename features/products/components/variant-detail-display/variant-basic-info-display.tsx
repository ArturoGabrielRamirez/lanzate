"use client"

import { Box, EditIcon, X, ArrowLeft, Check } from "lucide-react"
import { Product, ProductVariant } from "@prisma/client"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, InputField } from "@/features/layout/components"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { yupResolver } from "@hookform/resolvers/yup"
import { editVariantSchema } from "../../schemas/product-schema"
import DeleteVariantButton from "../delete-variant-button"
import Link from "next/link"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"

interface VariantBasicInfoDisplayProps {
    variant: ProductVariant & {
        color?: { name: string } | null
    }
    slug: string
    productId: number
    product: Product
}

const VariantBasicInfoDisplay = ({ variant, slug, productId, product }: VariantBasicInfoDisplayProps) => {
    const [isEditing, setIsEditing] = useState(false)

    const handleOpenEdit = () => {
        setIsEditing(true)
    }

    const handleCloseEdit = () => {
        setIsEditing(false)
    }

    return (
        <Card className="group/variant-basic-info-display">
            <Form
                submitButton={false}
                contentButton={false}
                resolver={yupResolver(editVariantSchema)}
                onSuccess={handleCloseEdit}
            >
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Link href={`/stores/${slug}/products/${productId}`}>
                                <ArrowLeft className="size-4" />
                            </Link>
                            <span className="flex items-center gap-2 text-lg md:text-xl">
                                <Box className="size-5" />
                                Información básica
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
                                                color={[99, 102, 241]} // color indigo del tema
                                                className="opacity-0 group-hover/variant-basic-info-display:opacity-100 transition-opacity duration-300"
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
                                                color={[161, 161, 170]} // color zinc del tema
                                                className="opacity-0 group-hover/variant-basic-info-display:opacity-100 transition-opacity duration-300"
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Cancelar edición
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <IconButton
                                                icon={EditIcon}
                                                onClick={handleOpenEdit}
                                                color={[161, 161, 170]} // color zinc del tema
                                                className="opacity-0 group-hover/variant-basic-info-display:opacity-100 transition-opacity duration-300"
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Editar información
                                        </TooltipContent>
                                    </Tooltip>
                                    <DeleteVariantButton
                                        variantId={variant.id}
                                        slug={slug}
                                        productId={productId}
                                        onlyIcon
                                    />
                                </div>
                            )}
                        </CardAction>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <div className="space-y-1">
                            <InputField
                                name="name"
                                label="Nombre"
                                defaultValue={variant.name || product.name || undefined}
                                placeholder="Ej. Camiseta"
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="space-y-1">
                            <InputField
                                name="sku"
                                label="SKU"
                                defaultValue={variant.sku || product.sku || undefined}
                                placeholder="Ej. SKU123"
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="space-y-1">
                            <InputField
                                name="barcode"
                                label="Código de barras"
                                defaultValue={variant.barcode || product.barcode || undefined}
                                placeholder="Ej. 1234567890123"
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="space-y-1">
                            <InputField
                                name="description"
                                label="Descripción"
                                defaultValue={variant.description || product.description || undefined}
                                placeholder="Ej. Camiseta de algodón"
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                </CardContent>
            </Form>
        </Card>
    )
}

export default VariantBasicInfoDisplay
