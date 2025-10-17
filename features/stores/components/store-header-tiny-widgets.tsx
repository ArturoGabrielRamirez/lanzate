import { Box, Rocket, ShoppingCart } from "lucide-react"

import { ItemGroup } from "@/features/shadcn/components/item"
import { TinyWidget } from "@/features/stores/components"

interface StoreHeaderTinyWidgetsProps {
    slug: string
}

function StoreHeaderTinyWidgets({ slug }: StoreHeaderTinyWidgetsProps) {
    return (
        <ItemGroup className="grid grid-cols-3 gap-2">
            <TinyWidget title="Productos" href={`/stores/${slug}/products`}>
                <Box />
                <span className="flex items-center gap-1">
                    <span className="text-foreground font-bold">10</span>
                    <span className="text-muted-foreground">items</span>
                </span>
            </TinyWidget>
            <TinyWidget title="Ordenes" href={`/stores/${slug}/orders`}>
                <ShoppingCart />
                <span className="flex items-center gap-1">
                    <span className="text-foreground font-bold">4</span>
                    <span className="text-muted-foreground">hoy</span>
                </span>
            </TinyWidget>
            <TinyWidget title="Alertas" href={`/stores/${slug}/notifications`}>
                <Rocket />
                <span className="flex items-center gap-1">
                    <span className="text-foreground font-bold">2</span>
                    <span className="text-muted-foreground">nuevos</span>
                </span>
            </TinyWidget>
        </ItemGroup>
    )
}

export { StoreHeaderTinyWidgets }