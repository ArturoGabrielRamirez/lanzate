"use client"

import { useState } from "react"
import { ColorPicker, ColorPickerAlpha, ColorPickerEyeDropper, ColorPickerFormat, ColorPickerHue, ColorPickerOutput, ColorPickerSelection } from '@/components/ui/shadcn-io/color-picker'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { ColorLike } from "color"
import Color from "color"
import { useFormContext } from "react-hook-form"

type ColorSelectorProps = {
    label: string
    defaultColor?: string
    onChange?: (color: number[]) => void
    className?: string
}

function ColorSelector({
    label,
    defaultColor = "#ef4444", // Red color as hex string
    onChange,
    className
}: ColorSelectorProps) {
    const [selectedColor, setSelectedColor] = useState<string>(defaultColor)
    const { setValue } = useFormContext()

    //(value: Parameters<typeof Color.rgb>[0]) => void
    const handleColorChange = (colorArray: ColorLike) => {
        // Convert ColorLike to RGB array and then to hex string
        const color = Color(colorArray)
        const [r, g, b] = color.rgb().array()
        const hexColor = `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`
        setSelectedColor(hexColor)
        setValue("primary_color", hexColor)
        onChange?.([r, g, b])
    }

    return (
        <Popover>
            <PopoverTrigger className={cn("flex items-center gap-2", className)}>
                <div className="aspect-square p-1.5 rounded-md bg-background">
                    <div
                        className="aspect-square rounded-sm size-8"
                        style={{ backgroundColor: selectedColor }}
                    />
                </div>
                <p className="text-sm text-muted-foreground">{label}</p>
            </PopoverTrigger>
            <PopoverContent>
                <ColorPicker
                    className="max-w-sm rounded-md border bg-background p-4 shadow-sm h-[300px]"
                    onChange={handleColorChange}
                    defaultValue={selectedColor}
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
    )
}

export default ColorSelector 