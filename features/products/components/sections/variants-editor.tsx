"use client"

import { Badge } from "@/features/shadcn/components/ui/badge"
import { Button } from "@/features/shadcn/components/ui/button"
import type { VariantPreview } from "@/features/products/type/create-form-extra"

type Props = {
    variant: VariantPreview
    onClose: () => void
}

export function VariantsEditor({ variant, onClose }: Props) {
    return (
        <div className="h-full w-full p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Editar variante</h3>
                <Button variant="secondary" size="sm" type="button" onClick={onClose}>Volver</Button>
            </div>
            <div className="flex items-center gap-3">
                {variant.size ? <Badge variant="secondary">{variant.size}</Badge> : <Badge variant="outline">Talle único</Badge>}
                {variant.color ? (
                    <div className="flex items-center gap-2">
                        <span className="inline-block size-4 rounded-sm border" style={{ backgroundColor: `rgba(${variant.color.rgba[0]}, ${variant.color.rgba[1]}, ${variant.color.rgba[2]}, ${variant.color.rgba[3]})` }} />
                        <Badge variant="secondary">{variant.color.name || 'Color'}</Badge>
                    </div>
                ) : null}
            </div>
            <div className="text-sm text-muted-foreground">(Formulario de datos de la variante en construcción)</div>
        </div>
    )
}

export default VariantsEditor


