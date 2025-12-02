"use client"

import { CloudDownload } from "lucide-react"

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/features/shadcn/components/empty"

export function DigitalPanel() {
    return (
        <div className="flex flex-col gap-4">
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <CloudDownload className="w-10 h-10 text-muted-foreground/50" />
                    </EmptyMedia>
                    <EmptyTitle>Configuración para productos digitales</EmptyTitle>
                    <EmptyDescription>
                        <p>Las opciones de configuración para productos digitales estarán disponibles próximamente.</p>
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        </div>
    )
}

