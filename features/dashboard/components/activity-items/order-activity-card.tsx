"use client"
/* import { Card, CardContent } from "@/components/ui/card" */
/* import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" */
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Clock, MapPin, Truck } from "lucide-react"
import { ActivityFeedItem } from "../../types"
import Link from "next/link"
import { formatActivityDate, getOrderStatusBadgeVariant } from "./shared-utils"
import { Avatar, Card, CardBody, CardFooter, CardHeader } from "@heroui/react";

type Props = {
    item: ActivityFeedItem & { type: 'order' }
}

function OrderActivityCard({ item }: Props) {
    return (
        <Card isPressable className="w-full !bg-background border-1 border-secondary/10">
            <CardHeader className="flex gap-3">
                <Avatar
                    showFallback
                    src={item.user.avatar || undefined}
                    alt={`${item.user.first_name} ${item.user.last_name}`}
                    name={`${item.user.first_name} ${item.user.last_name}`}
                />
                <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center justify-between grow">
                        <div className="flex items-center gap-1">
                            <p className="text-muted-foreground text-sm">
                                Nueva orden!
                            </p>
                            <Badge variant={getOrderStatusBadgeVariant(item.order?.status || 'PENDING')} className="text-xs hidden md:block">
                                {item.order?.status}
                            </Badge>
                        </div>
                        {item.order?.shipping_method === "PICKUP" ? <MapPin className="size-4 text-muted-foreground/50" /> : <Truck className="size-4 text-muted-foreground/50" />}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <span>${item.order?.total_price.toFixed(2)}</span>
                        <span>|</span>
                        <span className="font-medium ml-1">Items:</span> {item.order?.total_quantity}
                    </div>
                </div>
            </CardHeader>
            <CardBody className="space-y-3 relative z-10">
                <div className="flex items-start space-x-3">
                    <div className="flex-1 space-y-2">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between space-x-2">
                                <div className="flex items-center gap-1">
                                    <span className="font-medium text-sm md:text-base">
                                        {item.user.first_name} {item.user.last_name}
                                    </span>
                                    <span className="text-muted-foreground text-xs md:text-sm">realizó la orden</span>
                                    <Link
                                        href={`/stores/${item.order?.store.slug}/orders/${item.order?.id}`}
                                        className="font-medium text-primary hover:underline"
                                    >
                                        orden #{item.order?.id}
                                    </Link>

                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </CardBody>
            <CardFooter className="flex justify-between">
                <div className="flex items-center space-x-1 text-muted-foreground/50">
                    <ShoppingCart className="h-3 w-3 text-green-500" />
                    <span className="text-muted-foreground">
                        en{' '}
                        <Link
                            href={`/stores/${item.order?.store.slug}/overview`}
                            className="text-primary hover:underline"
                        >
                            {item.order?.store.name}
                        </Link>
                    </span>
                </div>
                <div className="flex items-center space-x-1 text-muted-foreground/50">
                    <Clock className="h-3 w-3" />
                    <span>{formatActivityDate(item.created_at)}</span>
                </div>
            </CardFooter>
        </Card>
    )
}

export default OrderActivityCard 