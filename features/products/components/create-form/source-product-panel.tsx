"use client"

import { BrainCircuit, FileSpreadsheet, PenTool } from "lucide-react"
import { Selection } from "react-aria-components"

import { ChoiceBox, ChoiceBoxDescription, ChoiceBoxItem, ChoiceBoxLabel } from "@/features/shadcn/components/ui/choice-box"

interface SourceProductPanelProps {
    onSelect: (source: "AI" | "FILE" | "MANUAL") => void
    selectedSource: "AI" | "FILE" | "MANUAL" | null
}

export function SourceProductPanel({ onSelect, selectedSource }: SourceProductPanelProps) {

    const handleSelectionChange = (keys: Selection) => {
        // ChoiceBox returns a Set or array of keys. Since selectionMode is single, we take the first one.
        const selected = Array.from(keys)[0] as "AI" | "FILE" | "MANUAL"
        if (selected) {
            onSelect(selected)
        }
    }

    return (
        <ChoiceBox
            columns={3}
            gap={4}
            selectionMode="single"
            selectedKeys={selectedSource ? [selectedSource] : []}
            defaultSelectedKeys={["MANUAL"]}
            onSelectionChange={handleSelectionChange}
            className="grid-cols-1 md:grid-cols-3"
        >
            <ChoiceBoxItem id="MANUAL" textValue="Manual" className="bg-accent/20">
                <PenTool />
                <ChoiceBoxLabel>Manual</ChoiceBoxLabel>
                <ChoiceBoxDescription>
                    Ingresa toda la información paso a paso.
                </ChoiceBoxDescription>
            </ChoiceBoxItem>

            <ChoiceBoxItem id="AI" textValue="IA" isDisabled className="bg-accent/20">
                <BrainCircuit />
                <ChoiceBoxLabel>IA</ChoiceBoxLabel>
                <ChoiceBoxDescription>
                    Genera tu producto automáticamente con inteligencia artificial.
                </ChoiceBoxDescription>
            </ChoiceBoxItem>

            <ChoiceBoxItem id="FILE" textValue="Archivo" isDisabled className="bg-accent/20">
                <FileSpreadsheet />
                <ChoiceBoxLabel>Archivo</ChoiceBoxLabel>
                <ChoiceBoxDescription>
                    Importa desde un archivo CSV, Excel o PDF.
                </ChoiceBoxDescription>
            </ChoiceBoxItem>

        </ChoiceBox>
    )
}

