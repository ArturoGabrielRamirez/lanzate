"use client"

import { useState, useEffect } from "react"
import { ColorPicker, ColorPickerAlpha, ColorPickerEyeDropper, ColorPickerFormat, ColorPickerHue, ColorPickerOutput, ColorPickerSelection } from '@/features/shadcn/components/shadcn-io/color-picker'
import { Popover, PopoverContent, PopoverTrigger } from "@/features/shadcn/components/ui/popover"
import { cn } from "@/lib/utils"
import { ColorLike } from "color"
import Color from "color"
import { useFormContext } from "react-hook-form"
import { useSettingsForm } from "./settings-form-provider"

type ColorSelectorProps = {
    label: string
    defaultColor?: string
    onChange?: (color: number[]) => void
    className?: string
    targetField?: "primary_color" | "background_color" | "background_foreground_color" | "header_color" | "header_foreground_color" | "filter_background_color" | "filter_text_color" | "product_card_background_color" | "product_card_text_color"
}

function ColorSelector({
    label,
    defaultColor = "#ef4444", // Red color as hex string
    onChange,
    className,
    targetField = "primary_color"
}: ColorSelectorProps) {
    const { setValue } = useFormContext()
    const { 
        background_color, 
        background_foreground_color,
        header_color,
        header_foreground_color,
        filter_background_color,
        filter_text_color,
        product_card_background_color,
        product_card_text_color,
        setBackgroundColor, 
        setBackgroundForegroundColor,
        setHeaderColor,
        setHeaderForegroundColor,
        setFilterBackgroundColor,
        setFilterTextColor,
        setProductCardBackgroundColor,
        setProductCardTextColor
    } = useSettingsForm()
    
    // Initialize with the appropriate color based on target field
    const getInitialColor = () => {
        switch (targetField) {
            case "background_color":
                return background_color
            case "background_foreground_color":
                return background_foreground_color
            case "header_color":
                return header_color
            case "header_foreground_color":
                return header_foreground_color
            case "filter_background_color":
                return filter_background_color
            case "filter_text_color":
                return filter_text_color
            case "product_card_background_color":
                return product_card_background_color
            case "product_card_text_color":
                return product_card_text_color
            default:
                return defaultColor
        }
    }
    
    const [selectedColor, setSelectedColor] = useState<string>(getInitialColor())

    // Update selected color when context colors change
    useEffect(() => {
        if (targetField === "background_color") {
            setSelectedColor(background_color)
        } else if (targetField === "background_foreground_color") {
            setSelectedColor(background_foreground_color)
        } else if (targetField === "header_color") {
            setSelectedColor(header_color)
        } else if (targetField === "header_foreground_color") {
            setSelectedColor(header_foreground_color)
        } else if (targetField === "filter_background_color") {
            setSelectedColor(filter_background_color)
        } else if (targetField === "filter_text_color") {
            setSelectedColor(filter_text_color)
        } else if (targetField === "product_card_background_color") {
            setSelectedColor(product_card_background_color)
        } else if (targetField === "product_card_text_color") {
            setSelectedColor(product_card_text_color)
        }
    }, [background_color, background_foreground_color, header_color, header_foreground_color, filter_background_color, filter_text_color, product_card_background_color, product_card_text_color, targetField])

    //(value: Parameters<typeof Color.rgb>[0]) => void
    const handleColorChange = (colorArray: ColorLike) => {
        // Convert ColorLike to RGB array and then to hex string
        const color = Color(colorArray)
        const [r, g, b] = color.rgb().array()
        const hexColor = `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`
        setSelectedColor(hexColor)
        setValue(targetField, hexColor)
        
        // Update the appropriate context based on target field
        switch (targetField) {
            case "background_color":
                setBackgroundColor(hexColor)
                break
            case "background_foreground_color":
                setBackgroundForegroundColor(hexColor)
                break
            case "header_color":
                setHeaderColor(hexColor)
                break
            case "header_foreground_color":
                setHeaderForegroundColor(hexColor)
                break
            case "filter_background_color":
                setFilterBackgroundColor(hexColor)
                break
            case "filter_text_color":
                setFilterTextColor(hexColor)
                break
            case "product_card_background_color":
                setProductCardBackgroundColor(hexColor)
                break
            case "product_card_text_color":
                setProductCardTextColor(hexColor)
                break
        }
        
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