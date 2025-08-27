"use client"

import { Button } from "@/components/ui/button"
import { ProductColorRow } from "@/features/products/components/product-color-row"
import type { ColorsSectionData } from "@/features/products/type/create-form-extra"
import { useState } from "react"

export function ColorsSection({ value, onChange }: { value?: ColorsSectionData; onChange?: (data: ColorsSectionData) => void }) {
    const [colors, setColors] = useState(value?.colors ?? [
        { id: `${Date.now()}-${Math.random()}`, name: "", rgba: [0, 0, 0, 1] }
    ])

    function handleRowChange(index: number, updated: any) {
        setColors((prev) => {
            const next = [...prev]
            next[index] = updated
            onChange?.({ colors: next })
            return next
        })
    }

    function handleRowDelete(index: number) {
        setColors((prev) => {
            const next = prev.filter((_, i) => i !== index)
            onChange?.({ colors: next })
            return next
        })
    }

    return (
        <div className="space-y-4">
            {colors.map((c, idx) => (
                <ProductColorRow
                    key={c.id}
                    color={c}
                    index={idx}
                    onChange={(_, updated) => handleRowChange(idx, updated)}
                    onDelete={() => handleRowDelete(idx)}
                    canDelete={colors.length > 1}
                />
            ))}
            <Button
                type="button"
                variant="outline"
                onClick={() => setColors((prev) => {
                    const next = [...prev, { id: `${Date.now()}-${Math.random()}`, name: "", rgba: [0, 0, 0, 1] }]
                    onChange?.({ colors: next })
                    return next
                })}
            >
                Agregar color
            </Button>
        </div>
    )
}

export default ColorsSection


