"use client"

import { Box, EditIcon, X, ArrowLeft, Check } from "lucide-react"
import { Product, ProductVariant } from "@prisma/client"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VariantLinkCard } from "./variant-link-card"
import { Form, InputField } from "@/features/layout/components"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { yupResolver } from "@hookform/resolvers/yup"
import { editVariantSchema } from "../../schemas/product-schema"
import { updateVariantBasicInfo } from "../../data/updateVariantBasicInfo"
import { toast } from "sonner"
import { useFormContext } from "react-hook-form"
import DeleteVariantButton from "../delete-variant-button"
import Link from "next/link"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"

interface VariantBasicInfoDisplayProps {
    variant: ProductVariant & {
        color?: { name: string } | null
    }
    slug: string
    productId: number
    product: Product & {
        variants: Array<ProductVariant & {
            color?: { name: string } | null
            stocks?: Array<{ quantity: number }>
            primary_media?: { url: string } | null
        }>
    }
}

function ToggleEditButton({ isEditing, onToggle, onCancel, variant }: {
    isEditing: boolean
    onToggle: () => void
    onCancel: () => void
    variant: ProductVariant
}) {
    const { reset } = useFormContext()

    const initialValues = {
        name: variant.name,
        sku: variant.sku,
        barcode: variant.barcode,
        description: variant.description
    }

    const handleClick = () => {
        if (isEditing) {
            reset(initialValues)
            onCancel()
            return
        }
        onToggle()
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <IconButton
                    type="button"
                    icon={isEditing ? X : EditIcon}
                    onClick={handleClick}
                    color={[161, 161, 170]} // color zinc del tema
                    className="opacity-0 group-hover/variant-basic-info-display:opacity-100 transition-opacity duration-300"
                />
            </TooltipTrigger>
            <TooltipContent>
                {isEditing ? "Cancelar edición" : "Editar información"}
            </TooltipContent>
        </Tooltip>
    )
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
                formAction={async (data: any) => {
                    try {
                        const result = await updateVariantBasicInfo(variant.id, {
                            name: data.name || null,
                            sku: data.sku || null,
                            barcode: data.barcode || null,
                            description: data.description || null
                        })
                        if (result.error) {
                            toast.error("Error al actualizar la variante", {
                                description: result.message
                            })
                            return result
                        }
                        toast.success("Variante actualizada correctamente")
                        return result
                    } catch (error) {
                        console.error("Error updating variant:", error)
                        toast.error("Error al actualizar la variante")
                        return { error: true, message: "Error al actualizar la variante", payload: null }
                    }
                }}
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
                            <div className="flex items-center gap-2">
                                {isEditing && (
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
                                )}
                                <ToggleEditButton
                                    isEditing={isEditing}
                                    onToggle={handleOpenEdit}
                                    onCancel={handleCloseEdit}
                                    variant={variant}
                                />
                                {!isEditing && (
                                    <DeleteVariantButton
                                        variantId={variant.id}
                                        slug={slug}
                                        productId={productId}
                                        onlyIcon
                                    />
                                )}
                            </div>
                        </CardAction>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Lista de variantes */}


                    {/* Formulario de información básica */}
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

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Otras variantes del producto</label>
                            <div className="grid gap-2 sm:grid-cols-2">
                                {product.variants
                                    .filter((v: any) => v.id !== variant.id)
                                    .map((otherVariant: any) => (
                                        <VariantLinkCard
                                            key={otherVariant.id}
                                            variant={otherVariant}
                                            slug={slug}
                                            productId={productId}
                                            productPrice={product.price}
                                        />
                                    ))
                                }
                                <Link
                                    href={`/stores/${slug}/products/${productId}`}
                                    className="rounded-md border p-3 flex items-center gap-3 hover:bg-secondary/50 transition-colors"
                                >
                                    <div className="h-12 w-12 rounded bg-secondary flex items-center justify-center">
                                        <Box className="size-6 text-muted-foreground" />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <span className="text-sm font-medium">Producto Principal</span>
                                        <span className="text-xs text-muted-foreground">{product.name}</span>
                                        <span className="text-xs text-muted-foreground">Precio base: ${product.price}</span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Form>
        </Card>
    )
}

export default VariantBasicInfoDisplay
