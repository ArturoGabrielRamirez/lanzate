"use client"

import { Scale, EditIcon, X, Check, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { updateVariantDimensionsData } from "@/features/products/data/update-variant-dimensions.data"
import type { VariantDimensionsDisplayProps } from "@/features/products/types"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { Input } from "@/features/shadcn/components/ui/input"
import { Label } from "@/features/shadcn/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shadcn/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"

const lengthUnits = ["MM", "CM", "M", "IN", "FT"] as const
const weightUnits = ["MG", "G", "KG", "OZ", "LB"] as const


function VariantDimensionsDisplay({ variant, product }: VariantDimensionsDisplayProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const handleOpenEdit = () => {
        setIsEditing(true)
    }

    const handleCloseEdit = () => {
        setIsEditing(false)
    }

    return (
        <Card className="group/variant-dimensions-display">
            <form
                onSubmit={async (e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    const data = {
                        weight: formData.get('weight') ? Number(formData.get('weight')) : null,
                        weight_unit: formData.get('weightUnit') as string || "KG",
                        height: formData.get('height') ? Number(formData.get('height')) : null,
                        height_unit: formData.get('heightUnit') as string || "CM",
                        width: formData.get('width') ? Number(formData.get('width')) : null,
                        width_unit: formData.get('widthUnit') as string || "CM",
                        depth: formData.get('depth') ? Number(formData.get('depth')) : null,
                        depth_unit: formData.get('depthUnit') as string || "CM",
                        diameter: formData.get('diameter') ? Number(formData.get('diameter')) : null,
                        diameter_unit: formData.get('diameterUnit') as string || "CM"
                    }
                    setIsSaving(true)
                    const response = await updateVariantDimensionsData(variant.id, data)
                    if (response.hasError) {
                        toast.error(response.message || "Error al actualizar las dimensiones")
                        setIsSaving(false)
                        return
                    }
                    toast.success(response.message || "Dimensiones actualizadas correctamente")
                    handleCloseEdit()
                    setIsSaving(false)
                }}
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
                                            icon={isSaving ? Loader2 : Check}
                                            iconClassName={isSaving ? "animate-spin" : undefined}
                                            type="submit"
                                            color={[99, 102, 241]}
                                            className="opacity-0 group-hover/variant-dimensions-display:opacity-100 transition-opacity duration-300"
                                            disabled={isSaving}
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
                        <div className="space-y-2">
                            <Label>Alto</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    name="height"
                                    placeholder="0"
                                    defaultValue={variant.height?.toString() || product.height?.toString()}
                                    disabled={!isEditing}
                                />
                                <Select
                                    name="heightUnit"
                                    defaultValue={variant.height_unit || product.height_unit || "CM"}
                                    disabled={!isEditing}
                                >
                                    <SelectTrigger className="w-28">
                                        <SelectValue placeholder="CM" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {lengthUnits.map(u => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <p className="text-xs text-muted-foreground/50">
                                Alto base del producto: {product.height ? `${product.height} ${product.height_unit || "CM"}` : "No especificado"}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label>Ancho</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    name="width"
                                    placeholder="0"
                                    defaultValue={variant.width?.toString() || product.width?.toString()}
                                    disabled={!isEditing}
                                />
                                <Select
                                    name="widthUnit"
                                    defaultValue={variant.width_unit || product.width_unit || "CM"}
                                    disabled={!isEditing}
                                >
                                    <SelectTrigger className="w-28">
                                        <SelectValue placeholder="CM" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {lengthUnits.map(u => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <p className="text-xs text-muted-foreground/50">
                                Ancho base del producto: {product.width ? `${product.width} ${product.width_unit || "CM"}` : "No especificado"}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label>Profundidad</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    name="depth"
                                    placeholder="0"
                                    defaultValue={variant.depth?.toString() || product.depth?.toString()}
                                    disabled={!isEditing}
                                />
                                <Select
                                    name="depthUnit"
                                    defaultValue={variant.depth_unit || product.depth_unit || "CM"}
                                    disabled={!isEditing}
                                >
                                    <SelectTrigger className="w-28">
                                        <SelectValue placeholder="CM" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {lengthUnits.map(u => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <p className="text-xs text-muted-foreground/50">
                                Profundidad base del producto: {product.depth ? `${product.depth} ${product.depth_unit || "CM"}` : "No especificado"}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label>Diámetro</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    name="diameter"
                                    placeholder="0"
                                    defaultValue={variant.diameter?.toString() || product.diameter?.toString()}
                                    disabled={!isEditing}
                                />
                                <Select
                                    name="diameterUnit"
                                    defaultValue={variant.diameter_unit || product.diameter_unit || "CM"}
                                    disabled={!isEditing}
                                >
                                    <SelectTrigger className="w-28">
                                        <SelectValue placeholder="CM" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {lengthUnits.map(u => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <p className="text-xs text-muted-foreground/50">
                                Diámetro base del producto: {product.diameter ? `${product.diameter} ${product.diameter_unit || "CM"}` : "No especificado"}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label>Peso</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    name="weight"
                                    placeholder="0"
                                    defaultValue={variant.weight?.toString() || product.weight?.toString()}
                                    disabled={!isEditing}
                                />
                                <Select
                                    name="weightUnit"
                                    defaultValue={variant.weight_unit || product.weight_unit || "KG"}
                                    disabled={!isEditing}
                                >
                                    <SelectTrigger className="w-28">
                                        <SelectValue placeholder="KG" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {weightUnits.map(u => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <p className="text-xs text-muted-foreground/50">
                                Peso base del producto: {product.weight ? `${product.weight} ${product.weight_unit || "KG"}` : "No especificado"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </form>
        </Card>
    )
}

export { VariantDimensionsDisplay }
