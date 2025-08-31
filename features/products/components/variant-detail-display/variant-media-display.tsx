"use client"

import { ImageIcon, EditIcon, X, Check, Upload } from "lucide-react"
import { Product, ProductMedia, ProductVariant } from "@prisma/client"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { FileUpload, FileUploadDropzone, FileUploadTrigger } from "@/components/ui/file-upload"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { updateVariantMedia } from "../../data/updateVariantMedia"

interface VariantMediaDisplayProps {
    variant: ProductVariant & {
        primary_media?: ProductMedia | null
        media?: ProductMedia[]
    }
    product: Product & {
        media?: ProductMedia[]
        primary_media?: ProductMedia | null
    }
}

const VariantMediaDisplay = ({ variant, product }: VariantMediaDisplayProps) => {
    const [isEditing, setIsEditing] = useState(false)

    const handleOpenEdit = () => {
        setIsEditing(true)
    }

    const handleCloseEdit = () => {
        setIsEditing(false)
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
                                    icon={Check}
                                    onClick={handleCloseEdit}
                                    color={[99, 102, 241]}
                                    className="opacity-0 group-hover/variant-media-display:opacity-100 transition-opacity duration-300"
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
                        <label className="text-sm font-medium">Imagen principal</label>
                        <div className="flex items-start gap-4 flex-col">
                            <div className="w-48 h-48 flex-shrink-0 overflow-hidden rounded-md bg-secondary relative">
                                {variant.primary_media?.url ? (
                                    <img
                                        src={variant.primary_media.url}
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
                            {!variant.primary_media?.url && (
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
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Imágenes disponibles del producto</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {product.media.map((media) => (
                                    <div
                                        key={media.id}
                                        className={`aspect-square overflow-hidden rounded-md bg-secondary ${isEditing ? 'cursor-pointer' : ''} border-2 transition-colors relative ${variant.primary_media?.id === media.id
                                            ? 'border-primary'
                                            : 'border-transparent hover:border-primary/50'
                                            }`}
                                        onClick={async () => {
                                            if (!isEditing) return
                                            const response = await updateVariantMedia(variant.id, {
                                                primary_media_id: media.id
                                            })
                                            if (response.error) {
                                                toast.error(response.message || "Error al actualizar la imagen")
                                                return
                                            }
                                            toast.success(response.message)
                                            // La UI se actualizará automáticamente cuando el servidor revalide los datos
                                        }}
                                    >
                                        <img
                                            src={media.url}
                                            alt="Product media"
                                            className="object-cover h-full w-full"
                                        />
                                        {variant.primary_media?.id === media.id && (
                                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                                                    Principal
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {variant.media && variant.media.length > 0 && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Imágenes específicas de la variante</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {variant.media.map((media) => (
                                    <div key={media.id} className="aspect-square overflow-hidden rounded-md bg-secondary">
                                        <img
                                            src={media.url}
                                            alt="Variant media"
                                            className="object-cover h-full w-full"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {isEditing && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Subir nueva imagen</label>
                            <FileUpload
                                maxFiles={1}
                                maxSize={2 * 1024 * 1024}
                                className="w-full"
                                onFileReject={(file, message) => toast.error(message)}
                                accept="image/jpg, image/png, image/jpeg"
                                onValueChange={async (files) => {
                                    if (files.length === 0) return
                                    const response = await updateVariantMedia(variant.id, { files })
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

export default VariantMediaDisplay
