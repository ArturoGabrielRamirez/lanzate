"use client"

import { Box } from "lucide-react"

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/features/shadcn/components/empty"

export function FisicalPanel() {
    return (
        <div className="flex flex-col gap-4">
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Box className="w-10 h-10 text-muted-foreground/50" />
                    </EmptyMedia>
                    <EmptyTitle>Configuración para productos físicos</EmptyTitle>
                    <EmptyDescription>
                        <p>Las opciones de configuración para productos físicos estarán disponibles próximamente.</p>
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        </div>
    )
}

