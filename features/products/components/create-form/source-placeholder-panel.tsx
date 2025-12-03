"use client"

import { ArrowLeft, BrainCircuit, FileSpreadsheet } from "lucide-react"

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/features/shadcn/components/empty"
import { Button } from "@/features/shadcn/components/ui/button"

interface SourcePlaceholderPanelProps {
    source: "AI" | "FILE"
    onBack: () => void
}

export function SourcePlaceholderPanel({ source, onBack }: SourcePlaceholderPanelProps) {
    const isAI = source === "AI"

    return (
        <Empty className="border">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    {isAI ? (
                        <BrainCircuit className="size-5" />
                    ) : (
                        <FileSpreadsheet className="size-5" />
                    )}
                </EmptyMedia>
                <EmptyTitle>
                    {isAI ? "Creación con IA" : "Importar desde archivo"}
                </EmptyTitle>
                <EmptyDescription>
                    {isAI
                        ? "Esta función estará disponible próximamente. Podrás generar productos automáticamente usando inteligencia artificial."
                        : "Esta función estará disponible próximamente. Podrás importar productos desde archivos CSV, Excel o PDF."}
                </EmptyDescription>
            </EmptyHeader>

            <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="size-4" />
                Volver a elegir método
            </Button>
        </Empty>
    )
}

