import { Boxes, Building2, ChartLine, Clock, Settings, ShoppingCart, Store, UsersRound } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Suspense } from "react"

import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/features/shadcn/components/item"
import { StoreBalanceBig, StoreBalanceBigSkeleton, StoreHeaderServer, StoreHeaderSkeleton } from "@/features/stores/components"

type StoreDetailsPageProps = {
    params: Promise<{ locale: string, slug: string }>
}

async function StoreDetailsPage({ params }: StoreDetailsPageProps) {

    const { slug } = await params

    const t = await getTranslations("store")

    return (
        <div className="p-4 grow flex flex-col gap-4">
            <Suspense fallback={<StoreHeaderSkeleton />}>
                <StoreHeaderServer slug={slug} />
            </Suspense>
            <div className="grow">
                <Suspense fallback={<StoreBalanceBigSkeleton />}>
                    <StoreBalanceBig slug={slug} />
                </Suspense>
            </div>
            <div className="pb-20 grid grid-cols-4 gap-4">
                <Item variant="outline" className="flex-col items-center p-2 bg-background/50">
                    <ItemMedia variant="icon" className="mx-auto size-10">
                        <Store className="size-6" />
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle className="font-medium text-xs">Cuenta</ItemTitle>
                        <ItemDescription className="hidden md:block">
                            Gestiona la cuenta de tu tienda.
                        </ItemDescription>
                    </ItemContent>
                </Item>
                <Item variant="outline" className="flex-col items-center p-2 bg-background/50">
                    <ItemMedia variant="icon" className="mx-auto size-10">
                        <Boxes className="size-6" />
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle className="font-medium text-xs">Productos</ItemTitle>
                        <ItemDescription className="hidden md:block">
                            Gestiona los productos de tu tienda.
                        </ItemDescription>
                    </ItemContent>
                </Item>
                <Item variant="outline" className="flex-col items-center p-2 bg-background/50">
                    <ItemMedia variant="icon" className="mx-auto size-10">
                        <ShoppingCart className="size-6" />
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle className="font-medium text-xs">Ordenes</ItemTitle>
                        <ItemDescription className="hidden md:block">
                            Gestiona las ordenes de tu tienda.
                        </ItemDescription>
                    </ItemContent>
                </Item>
                <Item variant="outline" className="flex-col items-center p-2 bg-background/50">
                    <ItemMedia variant="icon" className="mx-auto size-10">
                        <Building2 className="size-6" />
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle className="font-medium text-xs">Sucursales</ItemTitle>
                        <ItemDescription className="hidden md:block">
                            Gestiona las sucursales de tu tienda.
                        </ItemDescription>
                    </ItemContent>
                </Item>
                <Item variant="outline" className="flex-col items-center p-2 bg-background/50">
                    <ItemMedia variant="icon" className="mx-auto size-10">
                        <UsersRound className="size-6" />
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle className="font-medium text-xs">Empleados</ItemTitle>
                        <ItemDescription className="hidden md:block">
                            Gestiona los empleados de tu tienda.
                        </ItemDescription>
                    </ItemContent>
                </Item>
                <Item variant="outline" className="flex-col items-center p-2 bg-background/50 truncate max-md:block">
                    <ItemMedia variant="icon" className="mx-auto size-10">
                        <Settings className="size-6" />
                    </ItemMedia>
                    <ItemContent className="truncate">
                        <ItemTitle className="font-medium text-xs truncate">Configuración</ItemTitle>
                        <ItemDescription className="hidden md:block">
                            Gestiona la configuración de tu tienda.
                        </ItemDescription>
                    </ItemContent>
                </Item>
                <Item variant="outline" className="flex-col items-center p-2 bg-background/50">
                    <ItemMedia variant="icon" className="mx-auto size-10">
                        <ChartLine className="size-6" />
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle className="font-medium text-xs">Análisis</ItemTitle>
                        <ItemDescription className="hidden md:block">
                            Gestiona los análisis de tu tienda.
                        </ItemDescription>
                    </ItemContent>
                </Item>
                <Item variant="outline" className="flex-col items-center p-2 bg-background/50">
                    <ItemMedia variant="icon" className="mx-auto size-10">
                        <Clock className="size-6" />
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle className="font-medium text-xs">Historial</ItemTitle>
                        <ItemDescription className="hidden md:block">
                            Gestiona el historial de tu tienda.
                        </ItemDescription>
                    </ItemContent>
                </Item>
            </div>
        </div>
    )
}
export default StoreDetailsPage