"use client"

import { useFormContext } from "react-hook-form"

import type { VariantPreview } from "@/features/products/types/create-form-extra"
import type { ProductColor } from "@/features/products/types/product-color"
import { Badge } from "@/features/shadcn/components/ui/badge"
import { Button } from "@/features/shadcn/components/ui/button"

type Variant = {
    id: string
    size?: string
    color?: ProductColor
}

function VariantsPreviewSection({ onEditVariant }: { onEditVariant?: (v: VariantPreview) => void }) {
    const { watch, setValue } = useFormContext()
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

    const exclusions = (watch('variantExclusions') as string[] | undefined) ?? []
    const variants: Variant[] = []
    for (const size of dimensionList) {
        for (const color of colorList) {
            const id = `${size ?? 'one'}-${color ? color.id : 'one'}`
            if (exclusions.includes(id)) continue
            variants.push({ id, size, color })
        }
    }

    function handleDeleteVariant(v: Variant) {
        const hasOnlySize = (!!v.size && !v.color)
        const hasOnlyColor = (!v.size && !!v.color)
        const hasCombination = (!!v.size && !!v.color)

        if (hasOnlySize) {
            const currentSizes = (watch('sizes') as { label: string; value: string }[] | undefined) ?? []
            const currentMeasures = (watch('measures') as { label: string; value: string }[] | undefined) ?? []
            const nextSizes = currentSizes.filter(s => s.value !== v.size)
            const nextMeasures = currentMeasures.filter(m => m.value !== v.size)
            setValue('sizes', nextSizes, { shouldValidate: true, shouldDirty: true })
            setValue('measures', nextMeasures, { shouldValidate: true, shouldDirty: true })
            return
        }

        if (hasOnlyColor) {
            const currentColors = (watch('colors') as ProductColor[] | undefined) ?? []
            const nextColors = currentColors.filter(c => c.id !== v.color!.id)
            setValue('colors', nextColors, { shouldValidate: true, shouldDirty: true })
            return
        }

        if (hasCombination) {
            const exclusions = (watch('variantExclusions') as string[] | undefined) ?? []
            const key = `${v.size ?? 'one'}-${v.color?.id ?? 'one'}`
            const next = Array.from(new Set([...exclusions, key]))
            setValue('variantExclusions', next, { shouldValidate: false, shouldDirty: true })

            // After excluding this pair, if the size/measures value is no longer used by any combination, remove it
            if (v.size) {
                const stillUsesSize = (colorList || []).some((c) => {
                    const id = `${v.size}-${c ? c.id : 'one'}`
                    return !next.includes(id)
                })
                if (!stillUsesSize) {
                    const currentSizes = (watch('sizes') as { label: string; value: string }[] | undefined) ?? []
                    const currentMeasures = (watch('measures') as { label: string; value: string }[] | undefined) ?? []
                    const nextSizes = currentSizes.filter(s => s.value !== v.size)
                    const nextMeasures = currentMeasures.filter(m => m.value !== v.size)
                    setValue('sizes', nextSizes, { shouldValidate: true, shouldDirty: true })
                    setValue('measures', nextMeasures, { shouldValidate: true, shouldDirty: true })
                }
            }

            // After excluding, if the color is no longer used by any combination, remove it
            if (v.color) {
                const baseSizes: string[] = isUniqueSize ? [undefined as unknown as string] : (sizes.length > 0 && measures.length > 0 ? [...sizes, ...measures] : (sizes.length > 0 ? sizes : measures))
                const stillUsesColor = baseSizes.some((s) => {
                    const id = `${s ?? 'one'}-${v.color!.id}`
                    return !next.includes(id)
                })
                if (!stillUsesColor) {
                    const currentColors = (watch('colors') as ProductColor[] | undefined) ?? []
                    const nextColors = currentColors.filter(c => c.id !== v.color!.id)
                    setValue('colors', nextColors, { shouldValidate: true, shouldDirty: true })
                }
            }
            return
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
                                <Button size="sm" variant="secondary" type="button" onClick={() => onEditVariant?.(v)}>Editar</Button>
                                <Button size="sm" variant="destructive" type="button" onClick={() => handleDeleteVariant(v)}>Eliminar</Button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export { VariantsPreviewSection }


