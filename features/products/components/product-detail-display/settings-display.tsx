"use client"

import { Settings, EditIcon, X } from "lucide-react"
import { useState } from "react"

import type { SettingsDisplayProps } from "@/features/products/types"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import { Badge } from "@/features/shadcn/components/ui/badge"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"


function SettingsDisplay({ product }: SettingsDisplayProps) {
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
                        className="opacity-0 group-hover/settings-display:opacity-100 transition-opacity duration-300"
                    />
                </TooltipTrigger>
                <TooltipContent>
                    Editar configuraciones
                </TooltipContent>
            </Tooltip>
        )
    }

    return (
        <Card className="group/settings-display">
            <CardHeader>
                <CardTitle>
                    <span className="flex items-center gap-2 text-lg md:text-xl">
                        <Settings className="size-5" />
                        Configuraciones
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Estado</label>
                        <div className="flex items-center gap-2">
                           {/*  <Badge variant={product.is_active ? "default" : "secondary"}>
                                {product.is_active ? "Activo" : "Inactivo"}
                            </Badge> */}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Destacado</label>
                        <div className="flex items-center gap-2">
                            <Badge variant={product.is_featured ? "default" : "secondary"}>
                                {product.is_featured ? "Destacado" : "No destacado"}
                            </Badge>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Publicado</label>
                        <div className="flex items-center gap-2">
                            {/* <Badge variant={product.is_published ? "default" : "secondary"}>
                                {product.is_published ? "Publicado" : "Borrador"}
                            </Badge> */}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Fecha de expiración</label>
                        {/* <p className="text-sm text-muted-foreground">
                            {product.expiration_date ? new Date(product.expiration_date).toLocaleDateString() : "No especificada"}
                        </p> */}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export { SettingsDisplay }
