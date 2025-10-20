"use client"

import { Settings2, EditIcon, X, Check, Loader2 } from "lucide-react"
import { ProductMedia, Product, ProductVariant } from "@prisma/client"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { Form } from "@/features/layout/components"
import { useState } from "react"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
// removed unused resolver/schema
import { Switch } from "@/features/shadcn/components/ui/switch"
import { Label } from "@/features/shadcn/components/ui/label"
import { updateVariantFlags } from "../../actions/updateVariantFlags"
import { toast } from "sonner"

interface VariantConfigDisplayProps {
    variant: ProductVariant
    product: Product & {
        variants: (ProductVariant & {
            color?: { name: string } | null
            stocks?: { quantity: number; branch_id: number }[]
            primary_media?: ProductMedia | null
        })[]
    }
}

const VariantConfigDisplay = ({ variant }: VariantConfigDisplayProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [active, setActive] = useState<boolean>(!!variant.is_active)
    const [published, setPublished] = useState<boolean>(!!variant.is_published)
    const [featured, setFeatured] = useState<boolean>(!!variant.is_featured)

    const handleOpenEdit = () => {
        setIsEditing(true)
    }

    const handleCloseEdit = () => {
        setIsEditing(false)
    }

    return (
        <Card className="group/variant-config-display">
            <Form submitButton={false} contentButton={false}>
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
                                            onClick={async () => {
                                                try {
                                                    setIsSaving(true)
                                                    const payload = { is_active: active, is_published: published, is_featured: featured }
                                                    const { error, message } = await updateVariantFlags(variant.id, payload)
                                                    if (error) {
                                                        toast.error(message || "Error al guardar configuración")
                                                        setIsSaving(false)
                                                        return
                                                    }
                                                    toast.success("Configuración guardada")
                                                    handleCloseEdit()
                                                    setIsSaving(false)
                                                } catch {
                                                    toast.error("Error al guardar configuración")
                                                }
                                            }}
                                            color={[99, 102, 241]}
                                            className="opacity-0 group-hover/variant-config-display:opacity-100 transition-opacity duration-300"
                                            icon={isSaving ? Loader2 : Check}
                                            iconClassName={isSaving ? "animate-spin" : undefined}
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
                            <Switch id="is_active" checked={active} onCheckedChange={setActive} disabled={!isEditing} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="is_published" className="flex flex-col gap-1 items-start">
                                <span>Publicada</span>
                                <span className="font-normal text-sm text-muted-foreground">Visible públicamente</span>
                            </Label>
                            <Switch id="is_published" checked={published} onCheckedChange={setPublished} disabled={!isEditing} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="is_featured" className="flex flex-col gap-1 items-start">
                                <span>Destacada</span>
                                <span className="font-normal text-sm text-muted-foreground">Mostrar como destacada</span>
                            </Label>
                            <Switch id="is_featured" checked={featured} onCheckedChange={setFeatured} disabled={!isEditing} />
                        </div>
                    </div>
                </CardContent>
            </Form>
        </Card>
    )
}

export default VariantConfigDisplay
