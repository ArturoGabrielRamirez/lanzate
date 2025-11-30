"use client"

import { BrainCircuit, FileSpreadsheet, PenTool } from "lucide-react"
import { Selection } from "react-aria-components"
import { useFormContext } from "react-hook-form"

import { ProductSourceFormType } from "@/features/products/schemas/create-product-form-schema"
import { ChoiceBox, ChoiceBoxDescription, ChoiceBoxItem, ChoiceBoxLabel } from "@/features/shadcn/components/ui/choice-box"

export function SourceProductPanel() {
    const { setValue, watch } = useFormContext<ProductSourceFormType>()

    const selectedType = watch("source_info.type")

    const handleSelectionChange = (keys: Selection) => {
        // ChoiceBox returns a Set or array of keys. Since selectionMode is single, we take the first one.
        const selected = Array.from(keys)[0] as "AI" | "FILE" | "MANUAL"
        if (selected) {
            setValue("source_info.type", selected, { shouldValidate: true })
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <ChoiceBox
                columns={1}
                gap={4}
                selectionMode="single"
                selectedKeys={selectedType ? [selectedType] : []}
                onSelectionChange={handleSelectionChange}
                className="grid-cols-1 md:grid-cols-3"
            >
                <ChoiceBoxItem id="AI" textValue="IA">
                    <BrainCircuit className="size-8 mb-2 text-primary" />
                    <ChoiceBoxLabel>IA</ChoiceBoxLabel>
                    <ChoiceBoxDescription>
                        Genera tu producto automáticamente con inteligencia artificial.
                    </ChoiceBoxDescription>
                </ChoiceBoxItem>

                <ChoiceBoxItem id="FILE" textValue="Archivo">
                    <FileSpreadsheet className="size-8 mb-2 text-primary" />
                    <ChoiceBoxLabel>Archivo</ChoiceBoxLabel>
                    <ChoiceBoxDescription>
                        Importa desde un archivo CSV, Excel o PDF.
                    </ChoiceBoxDescription>
                </ChoiceBoxItem>

                <ChoiceBoxItem id="MANUAL" textValue="Manual">
                    <PenTool className="size-8 mb-2 text-primary" />
                    <ChoiceBoxLabel>Manual</ChoiceBoxLabel>
                    <ChoiceBoxDescription>
                        Ingresa toda la información paso a paso.
                    </ChoiceBoxDescription>
                </ChoiceBoxItem>
            </ChoiceBox>
        </div>
    )
}

