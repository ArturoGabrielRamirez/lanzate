"use client"

import { Settings2, EditIcon, X, Check } from "lucide-react"
import { ProductVariant } from "@prisma/client"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/features/layout/components"
import { useState } from "react"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { yupResolver } from "@hookform/resolvers/yup"
import { editVariantSchema } from "../../schemas/product-schema"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface VariantConfigDisplayProps {
    variant: ProductVariant
    product: any
}

const VariantConfigDisplay = ({ variant, product }: VariantConfigDisplayProps) => {
    const [isEditing, setIsEditing] = useState(false)

    const handleOpenEdit = () => {
        setIsEditing(true)
    }

    const handleCloseEdit = () => {
        setIsEditing(false)
    }

    return (
        <Card className="group/variant-config-display">
            <Form
                submitButton={false}
                contentButton={false}
                resolver={yupResolver(editVariantSchema)}
                onSuccess={handleCloseEdit}
            >
                <CardHeader>
                    <CardTitle>
                        <span className="flex items-center gap-2 text-lg md:text-xl">
                            <Settings2 className="size-5" />
                            Configuración
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
                                            className="opacity-0 group-hover/variant-config-display:opacity-100 transition-opacity duration-300"
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
                                            className="opacity-0 group-hover/variant-config-display:opacity-100 transition-opacity duration-300"
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
                                        className="opacity-0 group-hover/variant-config-display:opacity-100 transition-opacity duration-300"
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    Editar configuración
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="is_active" className="flex flex-col gap-1 items-start">
                                <span>Variante activa</span>
                                <span className="font-normal text-sm text-muted-foreground">
                                    La variante estará visible y disponible para la venta
                                </span>
                            </Label>
                            <Switch
                                id="is_active"
                                name="is_active"
                                defaultChecked={variant.is_active}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="is_default" className="flex flex-col gap-1 items-start">
                                <span>Variante por defecto</span>
                                <span className="font-normal text-sm text-muted-foreground">
                                    Esta será la variante principal del producto
                                </span>
                            </Label>
                            <Switch
                                id="is_default"
                                name="is_default"
                                defaultChecked={variant.is_default || false}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="track_inventory" className="flex flex-col gap-1 items-start">
                                <span>Control de inventario</span>
                                <span className="font-normal text-sm text-muted-foreground">
                                    Activar el seguimiento del stock de esta variante
                                </span>
                            </Label>
                            <Switch
                                id="track_inventory"
                                name="track_inventory"
                                defaultChecked={variant.track_inventory || false}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                </CardContent>
            </Form>
        </Card>
    )
}

export default VariantConfigDisplay
