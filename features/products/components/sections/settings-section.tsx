"use client"

import { useState } from "react"

import type { SettingsSectionData } from "@/features/products/types/create-form-extra"
import { Label } from "@/features/shadcn/components/ui/label"
import { Switch } from "@/features/shadcn/components/ui/switch"

type Props = {
    value?: SettingsSectionData
    onChange?: (data: SettingsSectionData) => void
}

function SettingsSection({ value, onChange }: Props) {
    const [isActive, setIsActive] = useState<boolean>(value?.isActive ?? true)
    const [isFeatured, setIsFeatured] = useState<boolean>(value?.isFeatured ?? false)
    const [isPublished, setIsPublished] = useState<boolean>(value?.isPublished ?? true)

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label htmlFor="is-active">Producto activo</Label>
                    <p className="text-sm text-muted-foreground">El producto estará disponible para la venta</p>
                </div>
                <Switch id="is-active" checked={isActive} onCheckedChange={(v) => { setIsActive(v); onChange?.({ isActive: v, isFeatured, isPublished }) }} />
            </div>
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label htmlFor="is-featured">Producto destacado</Label>
                    <p className="text-sm text-muted-foreground">Aparecerá en la sección de productos destacados</p>
                </div>
                <Switch id="is-featured" checked={isFeatured} onCheckedChange={(v) => { setIsFeatured(v); onChange?.({ isActive, isFeatured: v, isPublished }) }} />
            </div>
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label htmlFor="is-published">Producto publicado</Label>
                    <p className="text-sm text-muted-foreground">Será visible en la tienda pública</p>
                </div>
                <Switch id="is-published" checked={isPublished} onCheckedChange={(v) => { setIsPublished(v); onChange?.({ isActive, isFeatured, isPublished: v }) }} />
            </div>
        </div>
    )
}

export { SettingsSection }


