"use client"

import { Wrench } from "lucide-react"

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/features/shadcn/components/empty"

export function ServicePanel() {
    return (
        <div className="flex flex-col gap-4">
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Wrench className="w-10 h-10 text-muted-foreground/50" />
                    </EmptyMedia>
                    <EmptyTitle>Configuración para servicios</EmptyTitle>
                    <EmptyDescription>
                        <p>Las opciones de configuración para servicios estarán disponibles próximamente.</p>
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        </div>
    )
}

