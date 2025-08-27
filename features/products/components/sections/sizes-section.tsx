"use client"

import MultipleSelector from "@/components/expansion/multiple-selector"
import type { Option as MultiOption } from "@/components/expansion/multiple-selector"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useMemo, useState } from "react"
import type { SizesSectionData } from "@/features/products/type/create-form-extra"

type Props = {
    value?: SizesSectionData
    onChange?: (data: SizesSectionData) => void
}

export function SizesSection({ value, onChange }: Props) {
    const [isUniqueSize, setIsUniqueSize] = useState<boolean>(value?.isUniqueSize ?? false)
    const [selectedSizes, setSelectedSizes] = useState<MultiOption[]>(value?.sizes as MultiOption[] ?? [])

    const sizeOptions = useMemo<MultiOption[]>(() => {
        const letters = ["XS", "S", "M", "L", "XL", "XXL"].map((label) => ({ label, value: label, group: "Letras" }))
        const numbers = Array.from({ length: 44 - 20 + 1 }, (_, i) => String(20 + i)).map((label) => ({ label, value: label, group: "Números" }))
        return [...letters, ...numbers]
    }, [])

    function handleToggleUnique(v: boolean) {
        setIsUniqueSize(v)
        onChange?.({ isUniqueSize: v, sizes: selectedSizes })
    }

    function handleChangeSizes(opts: MultiOption[]) {
        setSelectedSizes(opts)
        onChange?.({ isUniqueSize, sizes: opts })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label htmlFor="unique-size">Talle único</Label>
                    <p className="text-sm text-muted-foreground">Si está habilitado, no se pueden seleccionar talles</p>
                </div>
                <Switch id="unique-size" checked={isUniqueSize} onCheckedChange={handleToggleUnique} />
            </div>

            <div className="space-y-3">
                <Label>Talles (letras y números)</Label>
                <MultipleSelector
                    className="w-full"
                    defaultOptions={sizeOptions}
                    value={selectedSizes}
                    onChange={handleChangeSizes}
                    placeholder="Selecciona o crea talles"
                    creatable
                    groupBy="group"
                    disabled={isUniqueSize}
                    hidePlaceholderWhenSelected
                />
            </div>
        </div>
    )
}

export default SizesSection


