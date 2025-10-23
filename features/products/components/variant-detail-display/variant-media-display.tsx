"use client"

import { ImageIcon, EditIcon, X, Check, Upload, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { updateVariantMediaData } from "@/features/products/data/update-variant-media.data"
import type { VariantMediaDisplayProps } from "@/features/products/types"
import { Button } from "@/features/shadcn/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { FileUpload, FileUploadDropzone, FileUploadTrigger } from "@/features/shadcn/components/ui/file-upload"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"


function VariantMediaDisplay({ variant, product }: VariantMediaDisplayProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [pendingPrimaryId, setPendingPrimaryId] = useState<number | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    function getMediaUrlById(id: number | null | undefined) {
        if (!id) return undefined
        if (variant.primary_media?.id === id) return variant.primary_media.url
        const inProduct = product.media?.find(m => m.id === id)?.url
        if (inProduct) return inProduct
        const inVariant = variant.media?.find(m => m.id === id)?.url
        if (inVariant) return inVariant
        if (product.primary_media?.id === id) return product.primary_media.url
        return undefined
    }

    const effectivePrimaryId = pendingPrimaryId ?? variant.primary_media?.id ?? null
    const effectivePrimaryUrl = getMediaUrlById(effectivePrimaryId)

    const handleOpenEdit = () => {
        setIsEditing(true)
    }

    const handleCloseEdit = () => {
        setPendingPrimaryId(null)
        setIsEditing(false)
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            if (pendingPrimaryId !== null && pendingPrimaryId !== variant.primary_media?.id) {
                const response = await updateVariantMediaData(variant.id, { primary_media_id: pendingPrimaryId })
                if (response.error) {
                    toast.error(response.message || "Error al actualizar la imagen")
                    return
                }
                toast.success(response.message)
            }
        } finally {
            setPendingPrimaryId(null)
            setIsEditing(false)
            setIsSaving(false)
        }
    }

    function ToggleEditButton() {
        const onClick = () => {
            if (isEditing) {
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
                        className="opacity-0 group-hover/variant-media-display:opacity-100 transition-opacity duration-300"
                    />
                </TooltipTrigger>
                <TooltipContent>
                    Editar medios de la variante
                </TooltipContent>
            </Tooltip>
        )
    }

    return (
        <Card className="group/variant-media-display">
            <CardHeader>
                <CardTitle>
                    <span className="flex items-center gap-2 text-lg md:text-xl">
                        <ImageIcon className="size-5" />
                        Medios de la variante
                    </span>
                </CardTitle>
                <CardAction>
                    {isEditing && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <IconButton
                                    icon={isSaving ? Loader2 : Check}
                                    iconClassName={isSaving ? "animate-spin" : undefined}
                                    onClick={handleSave}
                                    color={[99, 102, 241]}
                                    className="opacity-0 group-hover/variant-media-display:opacity-100 transition-opacity duration-300"
                                    disabled={isSaving}
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
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-1">
                        <label className="text-sm font-medium">Imagen principal</label>
                        <div className="flex items-start gap-4 flex-col">
                            <div className="relative w-full max-w-sm aspect-[3/4] overflow-hidden rounded-lg border bg-secondary">
                                {effectivePrimaryUrl ? (
                                    <img
                                        src={effectivePrimaryUrl}
                                        alt="Variant image"
                                        className="object-cover h-full w-full"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full p-4">
                                        <ImageIcon className="size-8 text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground text-center">
                                            Sin imagen principal
                                        </p>
                                    </div>
                                )}
                            </div>
                            {!effectivePrimaryUrl && (
                                <div className="flex-1 flex items-center">
                                    <p className="text-sm text-muted-foreground">
                                        La variante no tiene una imagen principal asignada.
                                        {isEditing && ' Selecciona una imagen de las disponibles abajo o sube una nueva.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {product.media && product.media.length > 0 && (
                        <div className="space-y-3 md:col-span-1">
                            <label className="text-sm font-medium">Imágenes disponibles del producto</label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {product.media.map((media) => (
                                    <div
                                        key={media.id}
                                        className={`relative aspect-square overflow-hidden rounded-md bg-secondary ${isEditing ? 'cursor-pointer' : 'pointer-events-none'} border transition shadow-sm ${(effectivePrimaryId === media.id)
                                            ? 'border-primary ring-2 ring-primary'
                                            : 'border-border hover:border-primary/50'
                                            }`}
                                        onClick={() => {
                                            if (!isEditing) return
                                            setPendingPrimaryId(media.id)
                                        }}
                                    >
                                        <img
                                            src={media.url}
                                            alt="Product media"
                                            className="object-cover h-full w-full"
                                        />
                                        {effectivePrimaryId === media.id && (
                                            <div className="absolute inset-0 bg-primary/15 flex items-center justify-center">
                                                <div className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded">
                                                    Principal
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    

                    {isEditing && (
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Subir nueva imagen</label>
                            <FileUpload
                                maxFiles={1}
                                maxSize={2 * 1024 * 1024}
                                className="w-full"
                                onFileReject={(file, message) => toast.error(message)}
                                accept="image/jpg, image/png, image/jpeg"
                                onValueChange={async (files) => {
                                    if (files.length === 0) return
                                    const response = await updateVariantMediaData(variant.id, { files })
                                    if (response.error) {
                                        toast.error(response.message || "Error al subir la imagen")
                                        return
                                    }
                                    toast.success(response.message)
                                    // La UI se actualizará automáticamente cuando el servidor revalide los datos
                                }}
                            >
                                <FileUploadDropzone>
                                    <div className="flex flex-col items-center gap-1 text-center">
                                        <div className="flex items-center justify-center rounded-full border p-2.5">
                                            <Upload className="size-6 text-muted-foreground" />
                                        </div>
                                        <p className="font-medium text-sm">Arrastra y suelta una imagen aquí</p>
                                        <p className="text-muted-foreground text-xs">O haz click para explorar</p>
                                    </div>
                                    <FileUploadTrigger asChild>
                                        <Button variant="outline" size="sm" className="mt-2 w-fit">
                                            Explorar archivos
                                        </Button>
                                    </FileUploadTrigger>
                                </FileUploadDropzone>
                            </FileUpload>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export { VariantMediaDisplay }
