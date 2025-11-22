"use client"

import { Plus } from "lucide-react"

import { Empty, EmptyHeader, EmptyTitle, EmptyMedia, EmptyDescription, EmptyContent } from "@/features/shadcn/components/empty"
import { Card, CardContent } from "@/features/shadcn/components/ui/card"
import { CreateStoreButton } from "@/features/stores/components/create-form/create-store-button"
import { NewStoreCardProps } from "@/features/stores/types"

function NewStoreCard({ userId, variant = "empty" }: NewStoreCardProps) {

    const isAddMore = variant === "add-more"
    const title = isAddMore ? "Nueva tienda" : "No tenés tiendas creadas"
    const description = isAddMore ? "¡Lleva tu negocio a otro nivel!" : "¡Creala ahora!"

    return (
        <Card className="p-0 md:p-0 lg:p-0 xl:p-0 opacity-50 hover:opacity-100 transition-all">
            <CardContent>
                <Empty className="lg:p-3 xl:p-3">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <Plus className="size-4 md:size-5 lg:size-6" />
                        </EmptyMedia>
                        <EmptyTitle className="leading-5 hidden md:block">
                            {title}
                        </EmptyTitle>
                        <EmptyDescription className="leading-4">
                            {description}
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <CreateStoreButton userId={userId} />
                    </EmptyContent>
                </Empty>
            </CardContent>
        </Card>
    )

}

export { NewStoreCard }
