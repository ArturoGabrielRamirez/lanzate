"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ProductColor } from "@/features/products/type/product-color"
import { useFormContext } from "react-hook-form"

type Variant = {
    id: string
    size?: string
    color?: ProductColor
}

export function VariantsPreviewSection() {
    const { watch } = useFormContext()
    const isUniqueSize = (watch('isUniqueSize') as boolean | undefined) ?? false
    const sizes = (watch('sizes') as { label: string; value: string }[] | undefined)?.map(s => s.value) ?? []
    const measures = (watch('measures') as { label: string; value: string }[] | undefined)?.map(m => m.value) ?? []
    const colors = watch('colors') as ProductColor[] | undefined

    // Dimension principal: si es talle único -> [undefined]
    // Caso contrario: usar talles si hay, si no hay usar tamaños; si ambos existen, combinarlos en una sola lista (misma dimensión)
    const dimensionList: (string | undefined)[] = isUniqueSize
        ? [undefined]
        : (sizes.length > 0 && measures.length > 0
            ? [...sizes, ...measures]
            : (sizes.length > 0 ? sizes : measures))
    const colorList = colors && colors.length > 0 ? colors : [undefined]

    const variants: Variant[] = []
    for (const size of dimensionList) {
        for (const color of colorList) {
            variants.push({ id: `${size ?? 'one'}-${color ? color.id : 'one'}`, size, color })
        }
    }

    return (
        <div className="space-y-4">
            <div className="text-sm text-muted-foreground">Variantes generadas: {variants.length}</div>
            {variants.length === 0 ? (
                <p className="text-sm text-muted-foreground">Agrega talles y/o colores para ver combinaciones.</p>
            ) : (
                <ul className="space-y-2">
                    {variants.map((v) => (
                        <li key={v.id} className="flex items-center justify-between rounded-md border p-2">
                            <div className="flex items-center gap-2">
                                {v.color && <span className="inline-block size-4 rounded-sm border" style={{ backgroundColor: `rgba(${v.color.rgba[0]}, ${v.color.rgba[1]}, ${v.color.rgba[2]}, ${v.color.rgba[3]})` }} />}
                                <span className="text-sm flex items-center gap-2">
                                    {v.size ? <Badge variant="secondary">{v.size}</Badge> : <Badge variant="outline">Talle único</Badge>}
                                    {v.color ? <Badge variant="secondary">{v.color.name || 'Color'}</Badge> : null}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="sm" variant="secondary" type="button" disabled>Editar</Button>
                                <Button size="sm" variant="destructive" type="button">Eliminar</Button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default VariantsPreviewSection


