"use client"

import { useMemo } from "react"
import { useFormContext } from "react-hook-form"

import type { SizesSectionProps } from "@/features/products/types"
import MultipleSelector from "@/features/shadcn/components/expansion/multiple-selector"
import type { Option as MultiOption } from "@/features/shadcn/components/expansion/multiple-selector"
import { Label } from "@/features/shadcn/components/ui/label"
import { Switch } from "@/features/shadcn/components/ui/switch"

function SizesSection({ value, onChange }: SizesSectionProps) {
    const { watch, setValue } = useFormContext()
    const isUniqueSize = (watch('isUniqueSize') as boolean | undefined) ?? (value?.isUniqueSize ?? false)
    const selectedSizes = (watch('sizes') as MultiOption[] | undefined) ?? (value?.sizes as MultiOption[] ?? [])
    const selectedMeasures = (watch('measures') as MultiOption[] | undefined) ?? (value?.measures as MultiOption[] ?? [])

    const sizeOptions = useMemo<MultiOption[]>(() => {
        const letters = ["XS", "S", "M", "L", "XL", "XXL"].map((label) => ({ label, value: label, group: "Letras" }))
        const numbers = Array.from({ length: 44 - 20 + 1 }, (_, i) => String(20 + i)).map((label) => ({ label, value: label, group: "Números" }))
        return [...letters, ...numbers]
    }, [])

    const measureOptions = useMemo<MultiOption[]>(() => {
        const volume = ["500ml", "1.5L"].map((label) => ({ label, value: label, group: "Volumen" }))
        const generic = ["chico", "mediano", "grande"].map((label) => ({ label, value: label, group: "Genéricos" }))
        return [...volume, ...generic]
    }, [])

    function handleToggleUnique(v: boolean) {
        setValue('isUniqueSize', v, { shouldValidate: true, shouldDirty: true })
        onChange?.({ isUniqueSize: v, sizes: selectedSizes })
    }

    function handleChangeSizes(opts: MultiOption[]) {
        setValue('sizes', opts, { shouldValidate: true, shouldDirty: true })
        onChange?.({ isUniqueSize, sizes: opts })
    }

    function handleChangeMeasures(opts: MultiOption[]) {
        setValue('measures', opts, { shouldValidate: true, shouldDirty: true })
        onChange?.({ isUniqueSize, sizes: selectedSizes, measures: opts })
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

            <div className="space-y-3">
                <Label>Tamaños (volúmenes o genéricos)</Label>
                <MultipleSelector
                    className="w-full"
                    defaultOptions={measureOptions}
                    value={selectedMeasures}
                    onChange={handleChangeMeasures}
                    placeholder="Selecciona o crea tamaños"
                    creatable
                    groupBy="group"
                    disabled={false}
                    hidePlaceholderWhenSelected
                />
            </div>
        </div>
    )
}

export { SizesSection }


