"use client"

import { ImageIcon, EditIcon, X, Check } from "lucide-react"
import { ProductVariant } from "@prisma/client"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface VariantMediaDisplayProps {
    variant: ProductVariant & {
        primary_media?: { id: number; url: string; type: string } | null
        media?: { id: number; url: string; type: string }[]
    }
    product: any
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
                        <div className="w-full h-48 overflow-hidden rounded-md bg-secondary relative">
                            {variant.primary_media?.url ? (
                                <img
                                    src={variant.primary_media.url}
                                    alt="Variant image"
                                    className="object-cover h-full w-full"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <ImageIcon className="size-12 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {product.media && product.media.length > 0 && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Imágenes disponibles del producto</label>
                            <p className="text-xs text-muted-foreground mb-2">
                                Selecciona una imagen para establecerla como imagen principal de esta variante
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {product.media.map((media: any) => (
                                    <div 
                                        key={media.id} 
                                        className={`aspect-square overflow-hidden rounded-md bg-secondary cursor-pointer border-2 transition-colors relative ${
                                            variant.primary_media?.id === media.id 
                                                ? 'border-primary' 
                                                : 'border-transparent hover:border-primary/50'
                                        }`}
                                        onClick={() => {
                                            // TODO: Implementar función para establecer como primary media
                                            console.log('Seleccionar imagen:', media.id)
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
                            <label className="text-sm font-medium">Subir nuevas imágenes</label>
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-4 text-center">
                                <ImageIcon className="size-8 mx-auto text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">
                                    Arrastra imágenes aquí o haz clic para seleccionar
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default VariantMediaDisplay
