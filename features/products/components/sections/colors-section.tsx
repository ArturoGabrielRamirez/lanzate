"use client"

import { Button } from "@/components/ui/button"
import { ProductColorRow } from "@/features/products/components/product-color-row"
import type { ColorsSectionData } from "@/features/products/type/create-form-extra"
import type { ProductColor } from "@/features/products/type/product-color"
import { useState } from "react"
import { useFormContext } from "react-hook-form"

export function ColorsSection({ value, onChange }: { value?: ColorsSectionData; onChange?: (data: ColorsSectionData) => void }) {
    const [colors, setColors] = useState<ProductColor[]>(value?.colors ?? [])
    const { formState: { errors }, setValue } = useFormContext()

    type NameFieldError = { message?: string }
    type ColorsErrors = Array<{ name?: NameFieldError }>
    function getColorError(i: number): string | undefined {
        const e = errors as unknown as { colors?: ColorsErrors }
        return e.colors?.[i]?.name?.message
    }

    function handleRowChange(index: number, updated: ProductColor) {
        setColors((prev) => {
            const next = [...prev]
            next[index] = updated
            onChange?.({ colors: next })
            setValue('colors', next, { shouldValidate: true, shouldDirty: true })
            return next
        })
    }

    function handleRowDelete(index: number) {
        setColors((prev) => {
            const next = prev.filter((_, i) => i !== index)
            onChange?.({ colors: next })
            setValue('colors', next, { shouldValidate: true, shouldDirty: true })
            return next
        })
    }

    return (
        <div className="space-y-4">
            {colors.length === 0 && (
                <p className="text-sm text-muted-foreground">Aún no agregaste colores.</p>
            )}
            {colors.map((c, idx) => (
                <ProductColorRow
                    key={c.id}
                    color={c}
                    index={idx}
                    onChange={(_, updated) => handleRowChange(idx, updated)}
                    onDelete={() => handleRowDelete(idx)}
                    canDelete={true}
                    error={getColorError(idx)}
                />
            ))}
            <Button
                type="button"
                variant="outline"
                onClick={() => setColors((prev) => {
                    const next: ProductColor[] = [...prev, { id: `${Date.now()}-${Math.random()}`, name: "", rgba: [0, 0, 0, 1] }]
                    onChange?.({ colors: next })
                    setValue('colors', next, { shouldValidate: true, shouldDirty: true })
                    return next
                })}
            >
                Agregar color
            </Button>
        </div>
    )
}

export default ColorsSection


