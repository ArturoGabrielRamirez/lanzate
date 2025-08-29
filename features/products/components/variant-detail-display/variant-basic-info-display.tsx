"use client"

import { Box, EditIcon, X, ArrowLeft } from "lucide-react"
import { ProductVariant } from "@prisma/client"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, InputField } from "@/features/layout/components"
import { useState } from "react"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { yupResolver } from "@hookform/resolvers/yup"
import { useFormContext } from "react-hook-form"
import { editVariantSchema } from "../../schemas/product-schema"
import DeleteVariantButton from "../delete-variant-button"
import Link from "next/link"

interface VariantBasicInfoDisplayProps {
    variant: ProductVariant & {
        color?: { name: string } | null
    }
    slug: string
    productId: number
}

type VariantBasicInfoFormValues = {
    size_or_measure: string
    sku: string
    barcode: string
}

const VariantBasicInfoDisplay = ({ variant, slug, productId }: VariantBasicInfoDisplayProps) => {
    const [isEditing, setIsEditing] = useState(false)

    const handleOpenEdit = () => {
        setIsEditing(true)
    }

    const handleCloseEdit = () => {
        setIsEditing(false)
    }

    function ToggleEditButton() {
        const { reset } = useFormContext<VariantBasicInfoFormValues>()

        const initialValues = {
            size_or_measure: variant.size_or_measure || "",
            sku: variant.sku || "",
            barcode: variant.barcode || "",
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
                        className="opacity-0 group-hover/variant-basic-info-display:opacity-100 transition-opacity duration-300"
                    />
                </TooltipTrigger>
                <TooltipContent>
                    Editar información básica de la variante
                </TooltipContent>
            </Tooltip>
        )
    }

    return (
        <Card className="group/variant-basic-info-display">
            <Form
                submitButton={false}
                contentButton={false}
                resolver={yupResolver(editVariantSchema)}
                onSuccess={handleCloseEdit}
                defaultValues={{
                    size_or_measure: variant.size_or_measure || "",
                    sku: variant.sku || "",
                    barcode: variant.barcode || "",
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
                                Información básica de la variante
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
                            <DeleteVariantButton
                                variantId={variant.id}
                                slug={slug}
                                productId={productId}
                            />
                            <ToggleEditButton />
                        </CardAction>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Talle/Tamaño</label>
                            {isEditing ? (
                                <InputField name="size_or_measure" type="text" label="Talle/Tamaño" />
                            ) : (
                                <p className="text-sm text-muted-foreground">{variant.size_or_measure || "No especificado"}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Color</label>
                            <p className="text-sm text-muted-foreground">{variant.color?.name || "No especificado"}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">SKU</label>
                            {isEditing ? (
                                <InputField name="sku" type="text" label="SKU" />
                            ) : (
                                <p className="text-sm text-muted-foreground">{variant.sku || "No especificado"}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Código de barras</label>
                            {isEditing ? (
                                <InputField name="barcode" type="text" label="Código de barras" />
                            ) : (
                                <p className="text-sm text-muted-foreground">{variant.barcode || "No especificado"}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Form>
        </Card>
    )
}

export default VariantBasicInfoDisplay
