"use client"

import { Settings } from "lucide-react"
import { useEffect } from "react"

import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/features/shadcn/components/empty"

export function ConfigurationsProductPanel() {
    const { setStepValid } = useCreateProductContext()

    // Validate step - for now always valid since we only show Empty component
    useEffect(() => {
        setStepValid(6, true)
    }, [setStepValid])

    return (
        <div className="flex flex-col gap-4">
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Settings className="w-10 h-10 text-muted-foreground/50" />
                    </EmptyMedia>
                    <EmptyTitle>Configuraciones del producto</EmptyTitle>
                    <EmptyDescription>
                        <p>Las opciones de configuración del producto estarán disponibles próximamente.</p>
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        </div>
    )
}

