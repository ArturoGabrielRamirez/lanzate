"use client"
import { Boxes, Calendar, EllipsisVertical, Globe, Loader2, ShoppingCart, StoreIcon, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/features/shadcn/components/ui/avatar"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { DropDrawer, DropDrawerContent, DropDrawerGroup, DropDrawerItem, DropDrawerTrigger } from "@/features/shadcn/components/components/ui/dropdrawer"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/features/shadcn/components/empty"
import { deleteStoreAction } from "@/features/stores/actions"
import { StoreCardLogo } from "@/features/stores/components"
import { StoreCardComponentProps } from "@/features/stores/types"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"


function StoreCard({ store, userId }: StoreCardComponentProps) {
    const t = useTranslations("store.store-card")
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDeleteStore = async () => {
        try {
            setIsDeleting(true)
            toast.loading("Deleting store...")

            if (!store || !store.id) throw new Error("Store not found")

            const { hasError, message } = await deleteStoreAction(store.id, userId)

            if (hasError) throw new Error(message)

            toast.dismiss()
            toast.success("Store deleted successfully")

        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An unknown error occurred")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Card className="transition-all gap-2 md:gap-3 lg:gap-4 group h-full group relative @container">
            <CardHeader className="gap-0 items-center hidden md:grid">
                <CardTitle className="flex items-start md:items-center gap-2 truncate">
                    <StoreCardLogo logo={store?.logo || ""} name={store?.name || ""} />
                    <div className="flex flex-col truncate">
                        <Link href={`/stores/${store?.slug || ""}`} className="cursor-pointer hover:text-primary transition-colors leading-0 truncate">
                            <h2 className="text-lg md:text-xl lg:text-2xl font-bold shrink-0 leading-6 truncate">{store?.name || ""}</h2>
                        </Link>
                        <CardDescription className="truncate">
                            <p className="text-sm text-muted-foreground truncate">
                                {store?.description || t("no-description")}
                            </p>
                        </CardDescription>
                    </div>
                </CardTitle>
                <CardAction className="shrink-0">
                    <DropDrawer>
                        <DropDrawerTrigger asChild>
                            <IconButton
                                className="shrink-0"
                                icon={EllipsisVertical}
                            />
                        </DropDrawerTrigger>
                        <DropDrawerContent>
                            <DropDrawerGroup>
                                <DropDrawerItem icon={<StoreIcon className="size-6 lg:size-4" />}>
                                    <Link href={`/stores/${store?.slug || ""}`}>
                                        Manage store
                                    </Link>
                                </DropDrawerItem>
                                <DropDrawerItem icon={<Boxes className="size-6 lg:size-4" />}>
                                    <Link href={`/stores/${store?.slug || ""}/products`}>
                                        Products
                                    </Link>
                                </DropDrawerItem>
                                <DropDrawerItem icon={<ShoppingCart className="size-6 lg:size-4" />}>
                                    <Link href={`/stores/${store?.slug || ""}/orders`}>
                                        Orders
                                    </Link>
                                </DropDrawerItem>
                                <DropDrawerItem icon={<Globe className="size-6 lg:size-4" />}>
                                    <Link href={`https://${store?.subdomain || ""}.lanzate.app`} target="_blank">
                                        Go to website
                                    </Link>
                                </DropDrawerItem>
                            </DropDrawerGroup>
                            <DropDrawerItem icon={isDeleting ? <Loader2 className="size-6 lg:size-4 text-destructive animate-spin" /> : <Trash2 className="size-6 lg:size-4 text-destructive" />} className="text-destructive" onClick={handleDeleteStore} disabled={isDeleting}>
                                {isDeleting ? "Deleting..." : "Delete Store"}
                            </DropDrawerItem>
                        </DropDrawerContent>
                    </DropDrawer>
                </CardAction>
            </CardHeader>
            <CardContent className="grow">
                <Empty className="md:hidden">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <Avatar className="aspect-square size-8 lg:size-10 shrink-0 border-2 border-primary hidden md:block">
                                <AvatarImage src={store?.logo || ""} alt={store?.name || ""} asChild className="aspect-square">
                                    <Image src={store?.logo || ""} alt={store?.name || ""} width={32} height={32} unoptimized className="aspect-square" />
                                </AvatarImage>
                                <AvatarFallback>
                                    <StoreIcon className="size-4 md:size-5 lg:size-6 text-primary/50 group-hover:text-primary transition-all" />
                                </AvatarFallback>
                            </Avatar>
                        </EmptyMedia>
                        <EmptyTitle>
                            {store?.name || ""}
                        </EmptyTitle>
                        <EmptyDescription>
                            {store?.description || t("no-description")}
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </CardContent>
            <CardFooter className="justify-center md:justify-between items-center flex-wrap">
                <p className="text-sm text-muted-foreground items-center gap-2 hidden @[230px]:flex">
                    <Calendar className="size-4" />
                    {store?.created_at.toLocaleDateString() || ""}
                </p>
                <div>
                    <p className="text-md text-muted-foreground">
                        {store?._count?.products || 0} {t("products")}
                    </p>
                </div>
            </CardFooter>
            <CardAction className="shrink-0 absolute top-0 right-0 md:hidden">
                <DropDrawer>
                    <DropDrawerTrigger asChild>
                        <IconButton
                            className="shrink-0"
                            icon={EllipsisVertical}
                        />
                    </DropDrawerTrigger>
                    <DropDrawerContent>
                        <DropDrawerGroup>
                            <DropDrawerItem icon={<StoreIcon className="size-6 lg:size-4" />}>
                                <Link href={`/stores/${store?.slug || ""}`}>
                                    Manage store
                                </Link>
                            </DropDrawerItem>
                            <DropDrawerItem icon={<Boxes className="size-6 lg:size-4" />}>
                                <Link href={`/stores/${store?.slug || ""}/products`}>
                                    Products
                                </Link>
                            </DropDrawerItem>
                            <DropDrawerItem icon={<ShoppingCart className="size-6 lg:size-4" />}>
                                <Link href={`/stores/${store?.slug || ""}/orders`}>
                                    Orders
                                </Link>
                            </DropDrawerItem>
                            <DropDrawerItem icon={<Globe className="size-6 lg:size-4" />}>
                                <Link href={`https://${store?.subdomain || ""}.lanzate.app`} target="_blank">
                                    Go to website
                                </Link>
                            </DropDrawerItem>
                        </DropDrawerGroup>
                        <DropDrawerItem icon={isDeleting ? <Loader2 className="size-6 lg:size-4 text-destructive animate-spin" /> : <Trash2 className="size-6 lg:size-4 text-destructive" />} className="text-destructive" onClick={handleDeleteStore} disabled={isDeleting}>
                            {isDeleting ? "Deleting..." : "Delete Store"}
                        </DropDrawerItem>
                    </DropDrawerContent>
                </DropDrawer>
            </CardAction>
        </Card>
    )
}

export { StoreCard }