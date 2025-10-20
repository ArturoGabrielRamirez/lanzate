"use client"

import { Input } from "@/features/shadcn/components/ui/input"
import { Label } from "@/features/shadcn/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shadcn/components/ui/select"
import { useFormContext } from "react-hook-form"
import type { DimensionsSectionData } from "@/features/products/type/create-form-extra"

const lengthUnits = ["MM", "CM", "M", "IN", "FT"] as const
const weightUnits = ["MG", "G", "KG", "OZ", "LB"] as const

type Props = { onChange?: (data: DimensionsSectionData) => void }

export function DimensionsSection({ onChange }: Props) {
    const { register, setValue, watch, formState: { errors } } = useFormContext()

    const height = watch('height') as number | undefined
    const width = watch('width') as number | undefined
    const depth = watch('depth') as number | undefined
    const diameter = watch('diameter') as number | undefined
    const weight = watch('weight') as number | undefined

    const heightUnit = watch('heightUnit') as string | undefined
    const widthUnit = watch('widthUnit') as string | undefined
    const depthUnit = watch('depthUnit') as string | undefined
    const diameterUnit = watch('diameterUnit') as string | undefined
    const weightUnit = watch('weightUnit') as string | undefined

    function snapshot(): DimensionsSectionData {
        return { height, heightUnit, width, widthUnit, depth, depthUnit, diameter, diameterUnit, weight, weightUnit }
    }

    function update<K extends keyof DimensionsSectionData>(key: K, v: DimensionsSectionData[K]) {
        setValue(key as keyof DimensionsSectionData, v, { shouldValidate: true, shouldDirty: true })
        onChange?.({ ...snapshot(), [key]: v })
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Alto</Label>
                <div className="flex items-center gap-2">
                    <Input type="number" placeholder="0" {...register('height', { valueAsNumber: true })} onChange={(e) => update("height", e.target.value ? Number(e.target.value) : undefined)} />
                    <Select value={heightUnit} onValueChange={(v) => update("heightUnit", v)}>
                        <SelectTrigger className="w-28">
                            <SelectValue placeholder="CM" />
                        </SelectTrigger>
                        <SelectContent>
                            {lengthUnits.map(u => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
                        </SelectContent>
                    </Select>
                </div>
                {errors.height && (<p className="text-sm text-red-500">{String(errors.height.message)}</p>)}
            </div>
            <div className="space-y-2">
                <Label>Ancho</Label>
                <div className="flex items-center gap-2">
                    <Input type="number" placeholder="0" {...register('width', { valueAsNumber: true })} onChange={(e) => update("width", e.target.value ? Number(e.target.value) : undefined)} />
                    <Select value={widthUnit} onValueChange={(v) => update("widthUnit", v)}>
                        <SelectTrigger className="w-28">
                            <SelectValue placeholder="CM" />
                        </SelectTrigger>
                        <SelectContent>
                            {lengthUnits.map(u => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
                        </SelectContent>
                    </Select>
                </div>
                {errors.width && (<p className="text-sm text-red-500">{String(errors.width.message)}</p>)}
            </div>
            <div className="space-y-2">
                <Label>Profundidad</Label>
                <div className="flex items-center gap-2">
                    <Input type="number" placeholder="0" {...register('depth', { valueAsNumber: true })} onChange={(e) => update("depth", e.target.value ? Number(e.target.value) : undefined)} />
                    <Select value={depthUnit} onValueChange={(v) => update("depthUnit", v)}>
                        <SelectTrigger className="w-28">
                            <SelectValue placeholder="CM" />
                        </SelectTrigger>
                        <SelectContent>
                            {lengthUnits.map(u => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
                        </SelectContent>
                    </Select>
                </div>
                {errors.depth && (<p className="text-sm text-red-500">{String(errors.depth.message)}</p>)}
            </div>
            <div className="space-y-2">
                <Label>Diámetro</Label>
                <div className="flex items-center gap-2">
                    <Input type="number" placeholder="0" {...register('diameter', { valueAsNumber: true })} onChange={(e) => update("diameter", e.target.value ? Number(e.target.value) : undefined)} />
                    <Select value={diameterUnit} onValueChange={(v) => update("diameterUnit", v)}>
                        <SelectTrigger className="w-28">
                            <SelectValue placeholder="CM" />
                        </SelectTrigger>
                        <SelectContent>
                            {lengthUnits.map(u => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
                        </SelectContent>
                    </Select>
                </div>
                {errors.diameter && (<p className="text-sm text-red-500">{String(errors.diameter.message)}</p>)}
            </div>
            <div className="space-y-2">
                <Label>Peso</Label>
                <div className="flex items-center gap-2">
                    <Input type="number" placeholder="0" {...register('weight', { valueAsNumber: true })} onChange={(e) => update("weight", e.target.value ? Number(e.target.value) : undefined)} />
                    <Select value={weightUnit} onValueChange={(v) => update("weightUnit", v)}>
                        <SelectTrigger className="w-28">
                            <SelectValue placeholder="KG" />
                        </SelectTrigger>
                        <SelectContent>
                            {weightUnits.map(u => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
                        </SelectContent>
                    </Select>
                </div>
                {errors.weight && (<p className="text-sm text-red-500">{String(errors.weight.message)}</p>)}
            </div>
        </div>
    )
}

export default DimensionsSection


