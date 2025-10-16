"use client"
import { Boxes, Calendar, EllipsisVertical, Loader2, Plus, ShoppingCart, StoreIcon, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropDrawer, DropDrawerContent, DropDrawerGroup, DropDrawerItem, DropDrawerTrigger } from "@/features/shadcn/components/components/ui/dropdrawer"
import { deleteStoreAction } from "@/features/stores/actions"
import { StoreCardProps } from "@/features/stores/types"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"

function StoreCard({ store, userId, isEmpty = false }: StoreCardProps) {

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
        <Card className="transition-all gap-2 md:gap-3 lg:gap-4 group h-full group relative">
            <CardHeader className="gap-0 items-center">
                <CardTitle className="flex items-start md:items-center gap-2 truncate">
                    <Avatar className="aspect-square size-8 lg:size-10 shrink-0 border-2 border-primary">
                        <AvatarImage src={isEmpty ? "" : store?.logo || ""} alt={isEmpty ? "" : store?.name || ""} asChild className="aspect-square">
                            <Image src={isEmpty ? "" : store?.logo || ""} alt={isEmpty ? "" : store?.name || ""} width={32} height={32} unoptimized className="aspect-square" />
                        </AvatarImage>
                        <AvatarFallback>
                            {isEmpty ? <Plus className="size-4 md:size-5 lg:size-6 text-primary/50 group-hover:text-primary transition-all" /> : <StoreIcon className="size-4 md:size-5 lg:size-6 text-primary/50 group-hover:text-primary transition-all" />}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col truncate">
                        {!isEmpty && (
                            <Link href={`/stores/${isEmpty ? "" : store?.slug || ""}/account`} className="cursor-pointer hover:text-primary transition-colors leading-0 truncate">
                                <h2 className="text-lg md:text-xl lg:text-2xl font-bold shrink-0 leading-6 truncate">{isEmpty ? "" : store?.name || ""}</h2>
                            </Link>
                        )}
                        {isEmpty && (
                            <h2 className="text-lg md:text-xl lg:text-2xl font-bold shrink-0 leading-6 truncate">New Store</h2>
                        )}
                        <CardDescription className="truncate">
                            <p className="text-sm text-muted-foreground truncate">
                                {isEmpty ? "Create your first store" : store?.description || t("no-description")}
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
                            {!isEmpty && (
                                <>
                                    <DropDrawerGroup>
                                        <DropDrawerItem icon={<StoreIcon className="size-6 lg:size-4" />}>
                                            <Link href={`/stores/${isEmpty ? "" : store?.slug || ""}/account`}>
                                                Manage store
                                            </Link>
                                        </DropDrawerItem>
                                        <DropDrawerItem icon={<Boxes className="size-6 lg:size-4" />}>
                                            <Link href={`/stores/${isEmpty ? "" : store?.slug || ""}/products`}>
                                                Products
                                            </Link>
                                        </DropDrawerItem>
                                        <DropDrawerItem icon={<ShoppingCart className="size-6 lg:size-4" />}>
                                            <Link href={`/stores/${isEmpty ? "" : store?.slug || ""}/orders`}>
                                                Orders
                                            </Link>
                                        </DropDrawerItem>
                                    </DropDrawerGroup>
                                    <DropDrawerItem icon={isDeleting ? <Loader2 className="size-6 lg:size-4 text-destructive animate-spin" /> : <Trash2 className="size-6 lg:size-4 text-destructive" />} className="text-destructive" onClick={handleDeleteStore} disabled={isDeleting}>
                                        {isDeleting ? "Deleting..." : "Delete Store"}
                                    </DropDrawerItem>
                                </>
                            )}
                            {isEmpty && (
                                <DropDrawerItem icon={<Plus className="size-6 lg:size-4" />}>
                                    <Link href="/stores/create">
                                        Create Store
                                    </Link>
                                </DropDrawerItem>
                            )}
                        </DropDrawerContent>
                    </DropDrawer>
                </CardAction>
            </CardHeader>
            <CardFooter className="justify-between items-center flex-wrap">
                {!isEmpty && (
                    <p className="text-sm text-muted-foreground items-center gap-2 hidden md:flex">
                        <Calendar className="size-4" />
                        {store?.created_at.toLocaleDateString() || ""}
                    </p>
                )}
                <div>
                    <p className="text-md text-muted-foreground">
                        {isEmpty ? "Click here to start." : `${store?._count?.products || 0} ${t("products")}`}
                    </p>
                    {isEmpty && (
                        <p className="text-sm text-muted-foreground">
                            Be the first to claim your custom domain!
                        </p>
                    )}
                </div>
            </CardFooter>
        </Card>
    )
}

export { StoreCard }
