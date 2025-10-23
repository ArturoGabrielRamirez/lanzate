"use client"

import { useFormContext } from "react-hook-form"

import { ProductColorRow } from "@/features/products/components/product-color-row"
import type { ProductColor, ColorsSectionProps } from "@/features/products/types"
import { Button } from "@/features/shadcn/components/ui/button"

function ColorsSection({ value, onChange }: ColorsSectionProps) {
    const { formState: { errors }, setValue, watch } = useFormContext()
    const colors = (watch('colors') as ProductColor[] | undefined) ?? (value?.colors ?? [])

    type NameFieldError = { message?: string }
    type ColorsErrors = Array<{ name?: NameFieldError }>
    function getColorError(i: number): string | undefined {
        const e = errors as unknown as { colors?: ColorsErrors }
        return e.colors?.[i]?.name?.message
    }

    function handleRowChange(index: number, updated: ProductColor) {
        const next = [...colors]
        next[index] = updated
        onChange?.({ colors: next })
        setValue('colors', next, { shouldValidate: true, shouldDirty: true })
    }

    function handleRowDelete(index: number) {
        const next = colors.filter((_, i) => i !== index)
        onChange?.({ colors: next })
        setValue('colors', next, { shouldValidate: true, shouldDirty: true })
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
                onClick={() => {
                    const next: ProductColor[] = [...colors, { id: `${Date.now()}-${Math.random()}`, name: "", rgba: [0, 0, 0, 1] }]
                    onChange?.({ colors: next })
                    setValue('colors', next, { shouldValidate: true, shouldDirty: true })
                }}
            >
                Agregar color
            </Button>
        </div>
    )
}

export { ColorsSection }


