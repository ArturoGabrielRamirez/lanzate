"use client"

import { useEffect, useMemo, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/features/shadcn/components/ui/popover"
import { ColorPicker, ColorPickerSelection, ColorPickerHue, ColorPickerAlpha, ColorPickerOutput, ColorPickerFormat, ColorPickerEyeDropper } from "@/features/shadcn/components/shadcn-io/color-picker"
import { Label } from "@/features/shadcn/components/ui/label"
import { Input } from "@/features/shadcn/components/ui/input"
import { Button } from "@/features/shadcn/components/ui/button"
import { X } from "lucide-react"
import Color, { ColorLike } from "color"
import type { ProductColor } from "../type/product-color"

type ProductColorRowProps = {
    color: ProductColor
    index: number
    onChange?: (index: number, color: ProductColor) => void
    onDelete?: (index: number) => void
    canDelete: boolean
    error?: string
}

function rgbaToHex(rgba: [number, number, number, number]) {
    const [r, g, b] = rgba
    const hex = `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`
    return hex
}

export function ProductColorRow({ color, index, onChange, onDelete, canDelete, error }: ProductColorRowProps) {
    const [name, setName] = useState<string>("")
    const [hexColor, setHexColor] = useState<string>(() => rgbaToHex(color.rgba))
    const [selectedColor, setSelectedColor] = useState<string>("#ef4444")

    useEffect(() => {
        setName(color.name)
        setHexColor(rgbaToHex(color.rgba))
    }, [color])

    function handleColorChange(colorArray: ColorLike) {
        const color = Color(colorArray)
        const [r, g, b] = color.rgb().array()
        const hexColor = `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`
        setSelectedColor(hexColor)
    }

    function handleNameChange(nextName: string) {
        setName(nextName)
        onChange?.(index, { ...color, name: nextName })
    }

    return (
        <div className="flex items-end gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <div className="aspect-square rounded-md bg-background">
                        <div className="aspect-square rounded-sm size-10" style={{ backgroundColor: selectedColor }} />
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                    <ColorPicker
                        className="max-w-sm rounded-md border bg-background p-4 shadow-sm h-[300px]"
                        onChange={handleColorChange}
                        defaultValue={hexColor}
                    >
                        <ColorPickerSelection />
                        <div className="flex items-center gap-4">
                            <ColorPickerEyeDropper />
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
                </PopoverContent>
            </Popover>
            <div className="w-full">
                <Label htmlFor={`color-name-${color.id}`}>Nombre fantasía</Label>
                <Input
                    id={`color-name-${color.id}`}
                    type="text"
                    placeholder="Ej: Océano profundo"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <div className="md:col-span-1 flex md:justify-end">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete?.(index)}
                    disabled={!canDelete}
                    aria-label="Eliminar color"
                >
                    <X className="size-4" />
                </Button>
            </div>
        </div>
    )
}


