import { Calendar, StoreIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getTranslations } from "next-intl/server"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StoreCardProps } from "@/features/stores/types"

async function StoreCard({ store }: StoreCardProps) {

    const t = await getTranslations("store.store-card")

    return (
        <Link href={`/stores/${store.slug}/account`}>
            <Card className="cursor-pointer transition-all gap-2 md:gap-3 lg:gap-4 shrink-0 group h-full group relative">
                <CardHeader className="gap-0">
                    <CardTitle className="flex items-center gap-2">
                        <Avatar className="aspect-square size-8 lg:size-10">
                            <AvatarImage src={store.logo || ""} alt={store.name} asChild className="aspect-square">
                                <Image src={store.logo || ""} alt={store.name} width={32} height={32} unoptimized className="aspect-square"/>
                            </AvatarImage>
                            <AvatarFallback>
                                <StoreIcon className="size-4 md:size-5 lg:size-6 text-primary/50 group-hover:text-primary transition-all" />
                            </AvatarFallback>
                        </Avatar>
                        <h2 className="text-lg md:text-xl lg:text-2xl font-bold shrink-0">{store.name}</h2>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{store.description || t("no-description")}</p>
                </CardContent>
                <CardFooter className="justify-between items-center gap-2">
                    <p className="text-sm text-muted-foreground items-center gap-2 hidden md:flex">
                        <Calendar className="size-4" />
                        {store.created_at.toLocaleDateString()}
                    </p>
                    <p className="text-md">
                        {store._count?.products || 0} {t("products")}
                    </p>
                </CardFooter>
            </Card>
        </Link>
    )
}

export { StoreCard }
