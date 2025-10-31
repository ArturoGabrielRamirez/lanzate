"use client"

import { ImageIcon, EditIcon, X } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import type { MediaDisplayProps } from "@/features/products/types"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"


function MediaDisplay({ product }: MediaDisplayProps) {
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
                        className="opacity-0 group-hover/media-display:opacity-100 transition-opacity duration-300"
                    />
                </TooltipTrigger>
                <TooltipContent>
                    Editar medios
                </TooltipContent>
            </Tooltip>
        )
    }

    return (
        <Card className="group/media-display">
            <CardHeader>
                <CardTitle>
                    <span className="flex items-center gap-2 text-lg md:text-xl">
                        <ImageIcon className="size-5" />
                        Medios
                    </span>
                </CardTitle>
                <CardAction>
                    {isEditing && (
                        <button
                            type="button"
                            onClick={handleCloseEdit}
                            className="text-sm bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 rounded-md"
                        >
                            Guardar
                        </button>
                    )}
                    <ToggleEditButton />
                </CardAction>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Imagen principal</label>
                        <div className="w-full h-48 overflow-hidden rounded-md bg-secondary relative">
                            {product.primary_media?.url ? (
                                <Image
                                    src={product.primary_media.url}
                                    alt={`${product.name} image`}
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
                            <label className="text-sm font-medium">Galería de imágenes</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {product.media.map((media) => (
                                    <div key={media.id} className="aspect-square overflow-hidden rounded-md bg-secondary">
                                        <Image
                                            src={media.url}
                                            alt={`${product.name} media`}
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

export { MediaDisplay }
