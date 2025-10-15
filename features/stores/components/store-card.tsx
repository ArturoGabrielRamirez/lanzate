"use client"
import { Calendar, EllipsisVertical, StoreIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropDrawer, DropDrawerContent, DropDrawerTrigger } from "@/features/shadcn/components/components/ui/dropdrawer"
import { StoreCardProps } from "@/features/stores/types"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"

function StoreCard({ store }: StoreCardProps) {

    const t = useTranslations("store.store-card")

    return (
        <Card className="transition-all gap-2 md:gap-3 lg:gap-4 shrink-0 group h-full group relative">
            <CardHeader className="gap-0 items-center">
                <CardTitle className="flex items-start md:items-center gap-2 truncate">
                    <Avatar className="aspect-square size-8 lg:size-10 shrink-0">
                        <AvatarImage src={store.logo || ""} alt={store.name} asChild className="aspect-square">
                            <Image src={store.logo || ""} alt={store.name} width={32} height={32} unoptimized className="aspect-square" />
                        </AvatarImage>
                        <AvatarFallback>
                            <StoreIcon className="size-4 md:size-5 lg:size-6 text-primary/50 group-hover:text-primary transition-all" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col truncate">
                        <Link href={`/stores/${store.slug}/account`} className="cursor-pointer hover:text-primary transition-colors leading-0 truncate">
                            <h2 className="text-lg md:text-xl lg:text-2xl font-bold shrink-0 leading-6 truncate">{store.name}</h2>
                        </Link>
                        <CardDescription className="truncate">
                            <p className="text-sm text-muted-foreground truncate">
                                {store.description || t("no-description")}
                            </p>
                        </CardDescription>
                    </div>
                </CardTitle>
                <CardAction className="shrink-0">
                    <DropDrawer>
                        <DropDrawerTrigger>
                            <IconButton
                                className="shrink-0"
                                icon={EllipsisVertical}
                            />
                        </DropDrawerTrigger>
                        <DropDrawerContent>

                        </DropDrawerContent>
                    </DropDrawer>
                </CardAction>
            </CardHeader>
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
    )
}

export { StoreCard }
