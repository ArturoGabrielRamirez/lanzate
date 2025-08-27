"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import type { DimensionsSectionData } from "@/features/products/type/create-form-extra"

const lengthUnits = ["MM", "CM", "M", "IN", "FT"] as const
const weightUnits = ["MG", "G", "KG", "OZ", "LB"] as const

type Props = {
    value?: DimensionsSectionData
    onChange?: (data: DimensionsSectionData) => void
}

export function DimensionsSection({ value, onChange }: Props) {
    const [state, setState] = useState<DimensionsSectionData>({
        heightUnit: value?.heightUnit ?? "CM",
        widthUnit: value?.widthUnit ?? "CM",
        depthUnit: value?.depthUnit ?? "CM",
        diameterUnit: value?.diameterUnit ?? "CM",
        weightUnit: value?.weightUnit ?? "KG",
        height: value?.height,
        width: value?.width,
        depth: value?.depth,
        diameter: value?.diameter,
        weight: value?.weight,
    })

    function update<K extends keyof DimensionsSectionData>(key: K, v: DimensionsSectionData[K]) {
        const next = { ...state, [key]: v }
        setState(next)
        onChange?.(next)
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Alto</Label>
                <div className="flex items-center gap-2">
                    <Input type="number" placeholder="0" value={state.height ?? ""} onChange={(e) => update("height", e.target.value ? Number(e.target.value) : undefined)} />
                    <Select value={state.heightUnit} onValueChange={(v) => update("heightUnit", v)}>
                        <SelectTrigger className="w-28">
                            <SelectValue placeholder="CM" />
                        </SelectTrigger>
                        <SelectContent>
                            {lengthUnits.map(u => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
                <Label>Ancho</Label>
                <div className="flex items-center gap-2">
                    <Input type="number" placeholder="0" value={state.width ?? ""} onChange={(e) => update("width", e.target.value ? Number(e.target.value) : undefined)} />
                    <Select value={state.widthUnit} onValueChange={(v) => update("widthUnit", v)}>
                        <SelectTrigger className="w-28">
                            <SelectValue placeholder="CM" />
                        </SelectTrigger>
                        <SelectContent>
                            {lengthUnits.map(u => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
                <Label>Profundidad</Label>
                <div className="flex items-center gap-2">
                    <Input type="number" placeholder="0" value={state.depth ?? ""} onChange={(e) => update("depth", e.target.value ? Number(e.target.value) : undefined)} />
                    <Select value={state.depthUnit} onValueChange={(v) => update("depthUnit", v)}>
                        <SelectTrigger className="w-28">
                            <SelectValue placeholder="CM" />
                        </SelectTrigger>
                        <SelectContent>
                            {lengthUnits.map(u => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
                <Label>Diámetro</Label>
                <div className="flex items-center gap-2">
                    <Input type="number" placeholder="0" value={state.diameter ?? ""} onChange={(e) => update("diameter", e.target.value ? Number(e.target.value) : undefined)} />
                    <Select value={state.diameterUnit} onValueChange={(v) => update("diameterUnit", v)}>
                        <SelectTrigger className="w-28">
                            <SelectValue placeholder="CM" />
                        </SelectTrigger>
                        <SelectContent>
                            {lengthUnits.map(u => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
                <Label>Peso</Label>
                <div className="flex items-center gap-2">
                    <Input type="number" placeholder="0" value={state.weight ?? ""} onChange={(e) => update("weight", e.target.value ? Number(e.target.value) : undefined)} />
                    <Select value={state.weightUnit} onValueChange={(v) => update("weightUnit", v)}>
                        <SelectTrigger className="w-28">
                            <SelectValue placeholder="KG" />
                        </SelectTrigger>
                        <SelectContent>
                            {weightUnits.map(u => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}

export default DimensionsSection


