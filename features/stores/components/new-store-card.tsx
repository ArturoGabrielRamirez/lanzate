"use client"

import { Plus } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Empty, EmptyHeader, EmptyTitle, EmptyMedia, EmptyDescription, EmptyContent } from "@/features/shadcn/components/empty"
import { CreateStoreButton } from "@/features/stores/components"
/* import CreateStoreButtonNew from "@/features/stores/components/create-store-button-new" */

interface NewStoreCardProps {
    userId: number
    variant?: "empty" | "add-more"
}

function NewStoreCard({ userId, variant = "empty" }: NewStoreCardProps) {

    const isAddMore = variant === "add-more"
    const title = isAddMore ? "New store" : "No stores yet"
    const description = isAddMore ? "Take your business to another level!" : "Be the first to claim your custom domain!"

    return (
        <Card className="p-0 md:p-0 lg:p-0 xl:p-0 border-dashed bg-card/50 hover:bg-card/75 transition-all group">
            <CardContent className="opacity-50 group-hover:opacity-100 transition-all">
                <Empty className="lg:p-3 xl:p-3">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <Plus className="size-4 md:size-5 lg:size-6" />
                        </EmptyMedia>
                        <EmptyTitle className="leading-5">
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
