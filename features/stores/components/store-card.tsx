"use client"

import { useRouter } from "@bprogress/next"
import { Boxes, Calendar, EllipsisVertical, Globe, Loader2, ShoppingCart, StoreIcon, Trash2 } from "lucide-react"
import * as motion from "motion/react-client"
import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"

import { DropDrawer, DropDrawerContent, DropDrawerGroup, DropDrawerItem, DropDrawerTrigger } from "@/features/shadcn/components/components/ui/dropdrawer"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/features/shadcn/components/empty"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/features/shadcn/components/ui/avatar"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { deleteStoreAction } from "@/features/stores/actions"
import { StoreCardLogo } from "@/features/stores/components"
import { StoreCardComponentProps } from "@/features/stores/types"


function StoreCard({ store, userId }: StoreCardComponentProps) {
    const t = useTranslations("store.store-card")
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDeleteStore = async () => {
        try {
            setIsDeleting(true)
            toast.loading("Eliminando tienda...")

            if (!store || !store.id) throw new Error("Tienda no encontrada")

            const { hasError, message } = await deleteStoreAction(store.id, userId)

            if (hasError) throw new Error(message)

            toast.dismiss()
            toast.success("Tienda eliminada con éxito")

        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Ocurrió un error desconocido")
        } finally {
            setIsDeleting(false)
        }
    }

    const handleClick = () => {
        router.push(`/stores/${store?.slug || ""}`)
    }

    return (
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="relative group shrink-0 grow">
            <Card onClick={handleClick} className="transition-all gap-2 md:gap-3 lg:gap-4 group h-full group relative @container cursor-pointer">
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
                                            Administrar tienda
                                        </Link>
                                    </DropDrawerItem>
                                    <DropDrawerItem icon={<Boxes className="size-6 lg:size-4" />}>
                                        <Link href={`/stores/${store?.slug || ""}/products`}>
                                            Productos
                                        </Link>
                                    </DropDrawerItem>
                                    <DropDrawerItem icon={<ShoppingCart className="size-6 lg:size-4" />}>
                                        <Link href={`/stores/${store?.slug || ""}/orders`}>
                                            Pedidos
                                        </Link>
                                    </DropDrawerItem>
                                    <DropDrawerItem icon={<Globe className="size-6 lg:size-4" />}>
                                        <Link href={`https://${store?.subdomain || ""}.lanzate.app`} target="_blank">
                                            Ir al sitio web
                                        </Link>
                                    </DropDrawerItem>
                                </DropDrawerGroup>
                                <DropDrawerItem icon={isDeleting ? <Loader2 className="size-6 lg:size-4 text-destructive animate-spin" /> : <Trash2 className="size-6 lg:size-4 text-destructive" />} className="text-destructive" onClick={handleDeleteStore} disabled={isDeleting}>
                                    {isDeleting ? "Eliminando..." : "Eliminar Tienda"}
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
                                        Administrar tienda
                                    </Link>
                                </DropDrawerItem>
                                <DropDrawerItem icon={<Boxes className="size-6 lg:size-4" />}>
                                    <Link href={`/stores/${store?.slug || ""}/products`}>
                                        Productos
                                    </Link>
                                </DropDrawerItem>
                                <DropDrawerItem icon={<ShoppingCart className="size-6 lg:size-4" />}>
                                    <Link href={`/stores/${store?.slug || ""}/orders`}>
                                        Pedidos
                                    </Link>
                                </DropDrawerItem>
                                <DropDrawerItem icon={<Globe className="size-6 lg:size-4" />}>
                                    <Link href={`https://${store?.subdomain || ""}.lanzate.app`} target="_blank">
                                        Ir al sitio web
                                    </Link>
                                </DropDrawerItem>
                            </DropDrawerGroup>
                            <DropDrawerItem icon={isDeleting ? <Loader2 className="size-6 lg:size-4 text-destructive animate-spin" /> : <Trash2 className="size-6 lg:size-4 text-destructive" />} className="text-destructive" onClick={handleDeleteStore} disabled={isDeleting}>
                                {isDeleting ? "Eliminando..." : "Eliminar Tienda"}
                            </DropDrawerItem>
                        </DropDrawerContent>
                    </DropDrawer>
                </CardAction>
            </Card>
        </motion.div>
    )
}

export { StoreCard }