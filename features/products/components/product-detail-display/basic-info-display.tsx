"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { Box, EditIcon, X } from "lucide-react"
import { useState } from "react"
import { useFormContext } from "react-hook-form"

import { Form } from "@/features/global/components/form/form"
import InputField from "@/features/global/components/form/input"
import { editProductSchema } from "@/features/products/schemas/product-schema"
import type { BasicInfoDisplayProps, BasicInfoFormValues } from "@/features/products/types"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"

function BasicInfoDisplay({ product }: BasicInfoDisplayProps) {
    const [isEditing, setIsEditing] = useState(false)

    const handleOpenEdit = () => {
        setIsEditing(true)
    }

    const handleCloseEdit = () => {
        setIsEditing(false)
    }

    function ToggleEditButton() {
        const { reset } = useFormContext<BasicInfoFormValues>()

        const initialValues = {
            name: product.name,
            description: product.description || "",
            sku: product.sku,
            barcode: product.barcode || "",
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
                        className="opacity-0 group-hover/basic-info-display:opacity-100 transition-opacity duration-300"
                    />
                </TooltipTrigger>
                <TooltipContent>
                    Editar información básica
                </TooltipContent>
            </Tooltip>
        )
    }

    return (
        <Card className="group/basic-info-display">
            <Form
                submitButton={false}
                contentButton={false}
                resolver={yupResolver(editProductSchema as never)}
                onSuccess={handleCloseEdit}
            >
                <CardHeader>
                    <CardTitle>
                        <span className="flex items-center gap-2 text-lg md:text-xl">
                            <Box className="size-5" />
                            Información básica
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
                            <label className="text-sm font-medium">Nombre</label>
                            {isEditing ? (
                                <InputField name="name" type="text" label="Nombre" />
                            ) : (
                                <p className="text-sm text-muted-foreground">{product.name}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">SKU</label>
                            {isEditing ? (
                                <InputField name="sku" type="text" label="SKU" />
                            ) : (
                                <p className="text-sm text-muted-foreground">{product.sku}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Código de barras</label>
                            {isEditing ? (
                                <InputField name="barcode" type="text" label="Código de barras" />
                            ) : (
                                <p className="text-sm text-muted-foreground">{product.barcode || "No especificado"}</p>
                            )}
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-sm font-medium">Descripción</label>
                            {isEditing ? (
                                <InputField name="description" type="textarea" label="Descripción" />
                            ) : (
                                <p className="text-sm text-muted-foreground">{product.description || "No hay descripción"}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Form>
        </Card>
    )
}

export { BasicInfoDisplay }
