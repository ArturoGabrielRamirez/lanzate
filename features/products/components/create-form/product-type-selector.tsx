"use client"

import { Box, Boxes } from "lucide-react"

import { ChoiceBox, ChoiceBoxDescription, ChoiceBoxItem, ChoiceBoxLabel } from "@/features/shadcn/components/ui/choice-box"
import { cn } from "@/lib/utils"

import type { Selection } from "react-aria-components"

interface ProductTypeSelectorProps {
    hasVariants: boolean
    onSelectionChange: (selection: Selection) => void
    disabled?: boolean
}

export function ProductTypeSelector({ hasVariants, onSelectionChange, disabled }: ProductTypeSelectorProps) {
    return (
        <div className="space-y-2">
            <p className="text-sm font-medium">Tipo de producto</p>
            <ChoiceBox
                columns={2}
                gap={4}
                selectionMode="single"
                selectedKeys={[hasVariants ? "variants" : "simple"]}
                onSelectionChange={onSelectionChange}
                className={cn(disabled && "pointer-events-none")}
                defaultSelectedKeys={hasVariants ? ["variants"] : ["simple"]}
            >
                <ChoiceBoxItem id="simple" textValue="Producto Simple">
                    <Box />
                    <ChoiceBoxLabel>Producto Simple</ChoiceBoxLabel>
                    <ChoiceBoxDescription>Un solo SKU, sin variaciones.</ChoiceBoxDescription>
                </ChoiceBoxItem>
                <ChoiceBoxItem id="variants" textValue="Con Variantes">
                    <Boxes />
                    <ChoiceBoxLabel>Con Variantes</ChoiceBoxLabel>
                    <ChoiceBoxDescription>Múltiples opciones (color, talle, etc.)</ChoiceBoxDescription>
                </ChoiceBoxItem>
            </ChoiceBox>
        </div>
    )
}

