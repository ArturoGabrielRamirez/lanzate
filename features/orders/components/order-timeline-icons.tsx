import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { cn } from "@/lib/utils"
import { Clock, CircleCheck, ShoppingBag, MapPin, PartyPopper } from "lucide-react"
import { Order, OrderItem, OrderPayment, OrderTracking, Product, Store } from "@prisma/client"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { Skeleton } from "@/features/shadcn/components/ui/skeleton"

type Props = {
    order: Order & { tracking: OrderTracking | null, items: (OrderItem & { product: Product })[] } & { payment: OrderPayment } & { store: Store }
}

const OrderTimelineIcons = ({ order }: Props) => {
    const isProcessing = order.status === "PROCESSING"
    const isReady = order.status === "READY"

    const isPreparingOrder = isReady && order.tracking?.tracking_status === "PREPARING_ORDER"
    const isWaitingForDelivery = isReady && order.tracking?.tracking_status === "WAITING_FOR_DELIVERY"
    const isOnTheWay = order.tracking?.tracking_status === "ON_THE_WAY"
    const isWaitingForPickup = isReady && order.tracking?.tracking_status === "WAITING_FOR_PICKUP"

    return (
        <div className="flex items-center justify-center flex-wrap gap-2">
            <Tooltip>
                <TooltipTrigger>
                    <IconButton
                        size={order.status === "PROCESSING" ? "lg" : "md"}
                        icon={() => <Clock className={cn("text-muted-foreground/50 size-5", order.status === "PROCESSING" && "text-green-600 animate-pulse size-6")} />}
                    />
                </TooltipTrigger>
                <TooltipContent>
                    <p>The order was just placed and is waiting for confirmation</p>
                </TooltipContent>
            </Tooltip>
            <Skeleton className={cn("w-5 h-1", isProcessing && "bg-green-600")} />
            <Tooltip>
                <TooltipTrigger>
                    <IconButton
                        size={order.status === "READY" && order.tracking?.tracking_status === "PREPARING_ORDER" ? "lg" : "md"}
                        icon={() => <CircleCheck className={cn("text-muted-foreground/50 size-5", order.status === "READY" && order.tracking?.tracking_status === "PREPARING_ORDER" && "text-green-600 size-6 animate-pulse")} />}
                    />
                </TooltipTrigger>
                <TooltipContent>
                    <p>The order was just confirmed and is waiting for the store to start packing it</p>
                </TooltipContent>
            </Tooltip>
            <Skeleton className={cn("w-5 h-1", isReady && order.tracking?.tracking_status === "PREPARING_ORDER" && "bg-green-600")} />
            <Tooltip>
                <TooltipTrigger>
                    <IconButton
                        size={order.status === "READY" && order.tracking?.tracking_status === "PREPARING_ORDER" ? "lg" : "md"}
                        icon={() => <ShoppingBag className={cn("text-muted-foreground/50 size-5", order.status === "READY" && order.tracking?.tracking_status === "PREPARING_ORDER" && "text-green-600 size-6 animate-pulse")} />}
                    />
                </TooltipTrigger>
                <TooltipContent>
                    <p>The order is being packed. Once it&apos;s done packing, it will be ready for {order.shipping_method === "DELIVERY" ? "delivery" : "pickup"}</p>
                </TooltipContent>
            </Tooltip>

            <Skeleton className={cn("w-5 h-1", isPreparingOrder && "bg-green-600")} />

            {order.shipping_method === "DELIVERY" && (
                <>
                    <Tooltip>
                        <TooltipTrigger>
                            <IconButton
                                size={order.status === "READY" && order.tracking?.tracking_status === "WAITING_FOR_DELIVERY" ? "lg" : "md"}
                                className={cn(
                                    "text-muted-foreground/50",
                                    order.tracking?.tracking_status === "WAITING_FOR_DELIVERY" && "text-green-600 animate-pulse"
                                )}
                                icon={
                                    () => (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="size-5"
                                            width={32}
                                            height={32}
                                            viewBox="0 0 24 24">
                                            <g fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M19.5 19.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M14.5 19.5h-5m10 0h.763c.22 0 .33 0 .422-.012a1.5 1.5 0 0 0 1.303-1.302c.012-.093.012-.203.012-.423V15a6.5 6.5 0 0 0-6.5-6.5M11 6h1c1.414 0 2.121 0 2.56.44C15 6.878 15 7.585 15 9v8.5M2 12v5c0 .935 0 1.402.201 1.75a1.5 1.5 0 0 0 .549.549c.348.201.815.201 1.75.201M7.85 7.85l-1.35-.9V4.7M2 6.5a4.5 4.5 0 1 0 9 0a4.5 4.5 0 0 0-9 0"></path></g>
                                        </svg>
                                    )}
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>The order is ready for delivery and is waiting for the delivery driver to pick it up</p>
                        </TooltipContent>
                    </Tooltip>
                    <Skeleton className={cn("w-5 h-1", isWaitingForDelivery && "bg-green-600")} />
                </>
            )}
            {order.shipping_method === "DELIVERY" && (
                <>
                    <Tooltip>
                        <TooltipTrigger>
                            <IconButton
                                size={"lg"}
                                className={cn(
                                    "text-muted-foreground/50",
                                    order.tracking?.tracking_status === "ON_THE_WAY" && "text-green-600 animate-pulse"
                                )}
                                icon={() => (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="size-5"
                                        width={32}
                                        height={32}
                                        viewBox="0 0 24 24">
                                        <g fill="none" stroke="currentColor" strokeWidth={1.5}>
                                            <path d="M19.5 17.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 17.5h-5m10 0h.763c.22 0 .33 0 .422-.012a1.5 1.5 0 0 0 1.303-1.302c.012-.093.012-.203.012-.423V13a6.5 6.5 0 0 0-6.5-6.5M2 4h10c1.414 0 2.121 0 2.56.44C15 4.878 15 5.585 15 7v8.5M2 12.75V15c0 .935 0 1.402.201 1.75a1.5 1.5 0 0 0 .549.549c.348.201.815.201 1.75.201M2 7h6m-6 3h4"></path>
                                        </g>
                                    </svg>
                                )}
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>The order is on the way to the customer&apos;s address</p>
                        </TooltipContent>
                    </Tooltip>
                    <Skeleton className={cn("w-5 h-1", isOnTheWay && "bg-green-600")} />
                </>
            )}
            {order.shipping_method === "PICKUP" && (
                <>
                    <Tooltip>
                        <TooltipTrigger>
                            <IconButton
                                size={order.status === "READY" && order.tracking?.tracking_status === "WAITING_FOR_PICKUP" ? "lg" : "md"}
                                icon={() => (
                                    <MapPin
                                        className={cn(
                                            "text-muted-foreground/50",
                                            order.tracking?.tracking_status === "WAITING_FOR_PICKUP" && "text-green-600 animate-pulse"
                                        )}
                                    />
                                )}
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>The order is ready for pickup and is waiting for the customer to pick it up</p>
                        </TooltipContent>
                    </Tooltip>
                    <Skeleton className={cn("w-5 h-1", isWaitingForPickup && "bg-green-600")} />
                </>
            )}
            <Tooltip>
                <TooltipTrigger>
                    <IconButton
                        size={order.status === "COMPLETED" ? "lg" : "md"}
                        icon={() => (
                            <PartyPopper
                                className={cn(
                                    "text-muted-foreground/50",
                                    order.status === "COMPLETED" && "text-green-600 animate-pulse"
                                )}
                            />
                        )}
                    />
                </TooltipTrigger>
                <TooltipContent>
                    <p>The order was just completed. Enjoy your purchase!</p>
                </TooltipContent>
            </Tooltip>


        </div>
    )
}
export default OrderTimelineIcons