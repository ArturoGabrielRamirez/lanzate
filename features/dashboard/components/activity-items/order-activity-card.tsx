import { ShoppingCart, Clock, MapPin, Truck } from "lucide-react"
import * as motion from "motion/react-client"
import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatActivityDate, getOrderStatusBadgeVariant, getUserInitials } from "@/features/dashboard/components/activity-items/shared-utils"
import { OrderActivityCardProps } from "@/features/dashboard/types"

function OrderActivityCard({ item }: OrderActivityCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative group"
        >
            <div className="absolute inset-0 border-primary group-hover:border-1 rounded-lg blur-sm"></div>
            <Card className="h-full group not-dark:bg-gradient-to-br not-dark:to-background not-dark:from-transparent not-dark:to-120% border-white/5 backdrop-blur-sm hover:!shadow-2xl dark:via-background hover:border-white/40 relative dark:hover:to-primary/20 dark:bg-card">
                <CardContent className="space-y-3">
                    <div className="flex items-start space-x-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage
                                src={item.user.avatar || undefined}
                                alt={`${item.user.first_name} ${item.user.last_name}`}
                            />
                            <AvatarFallback>
                                {getUserInitials(item.user.first_name, item.user.last_name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between space-x-2">
                                    <div className="flex items-center gap-1">
                                        <span className="font-medium text-primary">
                                            @{item.user.username}
                                        </span>
                                        <span className="text-muted-foreground text-xs md:text-sm">realizó la orden</span>
                                        <Link
                                            href={`/stores/${item?.store?.slug}/orders/${item?.order?.id}`}
                                            className="font-medium text-primary hover:underline"
                                        >
                                            orden #{item?.order?.id}
                                        </Link>
                                        <Badge variant={getOrderStatusBadgeVariant(item.order?.status || 'PENDING')} className="text-xs hidden md:block">
                                            {item.order?.status}
                                        </Badge>
                                    </div>
                                    {item.order?.shipping_method === "PICKUP" ? <MapPin className="size-4" /> : <Truck className="size-4" />}
                                </div>
                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                    ${item.order?.total_price.toFixed(2)} |
                                    <span className="font-medium ml-1">Items:</span> {item.order?.total_quantity} |

                                </div>

                            </div>

                            <div className="flex items-center space-x-4 text-xs text-muted-foreground justify-between">
                                <div className="flex items-center space-x-1">
                                    <ShoppingCart className="h-3 w-3 text-green-500" />
                                    <span className="text-muted-foreground">
                                        en{' '}
                                        <Link
                                            href={`/stores/${item?.store?.slug}/overview`}
                                            className="text-primary hover:underline"
                                        >
                                            {item?.store?.name}
                                        </Link>
                                    </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{formatActivityDate(item.created_at)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default OrderActivityCard 