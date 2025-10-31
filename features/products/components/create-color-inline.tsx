"use client"

import Color, { ColorLike } from "color"
import { useState } from "react"
import { toast } from "sonner"

import { createStoreColorData } from "@/features/products/data/create-store-color.data"
import type { CreateColorInlineProps } from "@/features/products/types"
import { ColorPicker, ColorPickerSelection, ColorPickerHue, ColorPickerAlpha, ColorPickerOutput, ColorPickerFormat } from "@/features/shadcn/components/shadcn-io/color-picker"
import { Button } from "@/features/shadcn/components/ui/button"
import { Input } from "@/features/shadcn/components/ui/input"

function CreateColorInline({ onCreated }: CreateColorInlineProps) {
    const [name, setName] = useState("")
    const [hex, setHex] = useState("#ff0000")
    const [isSaving, setIsSaving] = useState(false)

    function onColorChange(colorLike: ColorLike) {
        const c = Color(colorLike)
        const [r, g, b] = c.rgb().array()
        const next = `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`
        setHex(next)
    }

    return (
        <div className="rounded-md border p-3">
            <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Nombre del color</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Rojo intenso" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Seleccionar color</label>
                    <ColorPicker className="rounded-md border p-3" onChange={onColorChange} defaultValue={hex}>
                        <ColorPickerSelection />
                        <div className="flex items-center gap-4">
                            <div className="grid w-full gap-1">
                                <ColorPickerHue />
                                <ColorPickerAlpha />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <ColorPickerOutput />
                            <ColorPickerFormat />
                        </div>
                    </ColorPicker>
                </div>
            </div>
            <div className="flex justify-end pt-2">
                <Button
                    type="button"
                    disabled={!name || isSaving}
                    onClick={async () => {
                        try {
                            setIsSaving(true)
                            const { hasError, message, payload } = await createStoreColorData({ name, hex })
                            if (hasError || !payload) {
                                toast.error(message || "Error al crear color")
                                setIsSaving(false)
                                return
                            }
                            toast.success("Color creado")
                            onCreated?.(payload)
                            setIsSaving(false)
                            setName("")
                        } catch (e) {
                            toast.error("Error al crear color")
                            setIsSaving(false)
                        }
                    }}
                >
                    Crear color
                </Button>
            </div>
        </div>
    )
}

export { CreateColorInline }


