import { Box, Rocket, ShoppingCart } from "lucide-react"

import { ItemGroup } from "@/features/shadcn/components/item"
import { TinyWidget } from "@/features/stores/components"

interface StoreHeaderTinyWidgetsProps {
    slug: string
}

function StoreHeaderTinyWidgets({ slug }: StoreHeaderTinyWidgetsProps) {
    return (
        <ItemGroup className="grid grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-2 md:gap-4">
            <TinyWidget title="Productos" href={`/stores/${slug}/products`}>
                <Box className="size-8" />
                <span className="flex flex-col">
                    <span className="font-bold text-xl leading-4">10</span>
                    <span className="text-background/70 dark:text-muted-foreground text-xs leading-4">items</span>
                </span>
            </TinyWidget>
            <TinyWidget title="Ordenes" href={`/stores/${slug}/orders`}>
                <ShoppingCart className="size-8" />
                <span className="flex flex-col">
                    <span className="font-bold text-xl leading-4">4</span>
                    <span className="text-background/70 dark:text-muted-foreground text-xs leading-4">hoy</span>
                </span>
            </TinyWidget>
            <TinyWidget title="Alertas" href={`/stores/${slug}/notifications`}>
                <Rocket className="size-8" />
                <span className="flex flex-col">
                    <span className="font-bold text-xl leading-4">2</span>
                    <span className="text-background/70 dark:text-muted-foreground text-xs leading-4">nuevos</span>
                </span>
            </TinyWidget>
        </ItemGroup>
    )
}

export { StoreHeaderTinyWidgets }