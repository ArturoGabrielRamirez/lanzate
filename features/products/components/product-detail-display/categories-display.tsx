"use client"

import { Product, Category } from "@prisma/client"
import { Tags, EditIcon, X } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/features/shadcn/components/ui/badge"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"

interface CategoriesDisplayProps {
    product: Product & {
        categories: Category[]
    }
}

function CategoriesDisplay({ product }: CategoriesDisplayProps) {
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
                        className="opacity-0 group-hover/categories-display:opacity-100 transition-opacity duration-300"
                    />
                </TooltipTrigger>
                <TooltipContent>
                    Editar categorías
                </TooltipContent>
            </Tooltip>
        )
    }

    return (
        <Card className="group/categories-display">
            <CardHeader>
                <CardTitle>
                    <span className="flex items-center gap-2 text-lg md:text-xl">
                        <Tags className="size-5" />
                        Categorías
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
                        <label className="text-sm font-medium">Categorías asignadas</label>
                        {product.categories.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No hay categorías asignadas</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {product.categories.map((category) => (
                                    <Badge key={category.id} variant="outline">
                                        {category.name}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {isEditing && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Seleccionar categorías</label>
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-4 text-center">
                                <Tags className="size-8 mx-auto text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">
                                    Selecciona las categorías para este producto
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export { CategoriesDisplay }
