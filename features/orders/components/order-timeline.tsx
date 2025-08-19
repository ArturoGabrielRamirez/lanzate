"use client"

import { useStep } from "@/hooks/use-step"
import { cn } from "@/lib/utils"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { Order, OrderItem, OrderPayment, OrderTracking, Product, Store } from "@prisma/client"
import { CircleCheck, Clock, PartyPopper, ShoppingBag, MapPin } from "lucide-react"
import ConfirmOrderButton from "./confirm-order-button"
import OrderReadyButton from "./order-ready-button"
import PickedUpOrderButton from "./picked-up-order-button"
import FinalizeOrderButton from "./finalize-order-button"
import { CancelOrderButton } from "@/features/stores/components"

type Props = {
    order: Order & { tracking: OrderTracking | null, items: (OrderItem & { product: Product })[] } & { payment: OrderPayment } & { store: Store }
}

const OrderTimeline = ({ order }: Props) => {

    const [currentStep] = useStep(4)
    console.log("🚀 ~ OrderTimeline ~ currentStep:", currentStep)
    console.log("🚀 ~ OrderTimeline ~ order:", order)

    return (
        <div className="grow flex flex-col">
            <div className="flex items-center gap-2 justify-center">
                <IconButton
                    size={order.status === "PROCESSING" ? "lg" : "md"}
                    icon={() => <Clock className={cn("text-muted-foreground/50 size-5", order.status === "PROCESSING" && "text-primary animate-pulse size-6")} />}
                />
                <IconButton
                    size={order.status === "READY" && order.tracking?.tracking_status === "PREPARING_ORDER" ? "lg" : "md"}
                    icon={() => <CircleCheck className={cn("text-muted-foreground/50 size-5", order.status === "READY" && order.tracking?.tracking_status === "PREPARING_ORDER" && "text-primary size-6 animate-pulse")} />}
                />
                <IconButton
                    size={order.status === "READY" && order.tracking?.tracking_status === "PREPARING_ORDER" ? "lg" : "md"}
                    icon={() => <ShoppingBag className={cn("text-muted-foreground/50 size-5", order.status === "READY" && order.tracking?.tracking_status === "PREPARING_ORDER" && "text-primary size-6 animate-pulse")} />}
                />
                {order.shipping_method === "DELIVERY" && (
                    <IconButton
                        size={order.status === "READY" && order.tracking?.tracking_status === "WAITING_FOR_DELIVERY" ? "lg" : "md"}
                        className={cn(
                            "text-muted-foreground/50",
                            order.tracking?.tracking_status === "WAITING_FOR_DELIVERY" && "text-primary animate-pulse"
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
                )}
                {order.shipping_method === "DELIVERY" && (
                    <IconButton
                        size={"lg"}
                        className={cn(
                            "text-muted-foreground/50",
                            order.tracking?.tracking_status === "ON_THE_WAY" && "text-primary animate-pulse"
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
                )}
                {order.shipping_method === "PICKUP" && (
                    <IconButton
                        size={order.status === "READY" && order.tracking?.tracking_status === "WAITING_FOR_PICKUP" ? "lg" : "md"}
                        icon={() => (
                            <MapPin
                                className={cn(
                                    "text-muted-foreground/50",
                                    order.tracking?.tracking_status === "WAITING_FOR_PICKUP" && "text-primary animate-pulse"
                                )}
                            />
                        )}
                    />
                )}
                <IconButton
                    size={order.status === "COMPLETED" ? "lg" : "md"}
                    icon={() => (
                        <PartyPopper
                            className={cn(
                                "text-muted-foreground/50",
                                order.status === "COMPLETED" && "text-primary animate-pulse"
                            )}
                        />
                    )}
                />
            </div>
            <div className="grow flex flex-col gap-2">
                <div className="grow flex flex-col justify-center items-center text-center">
                    {order.status === "PROCESSING" && (
                        <>
                            <p className="text-lg font-bold">New order placed</p>
                            <p className="text-muted-foreground mb-4">A new order was just placed. Check you have enough in-store stock and confirm the order!</p>
                            <ConfirmOrderButton order={order} canUpdateOrders={true} />
                        </>
                    )}
                    {order.status === "READY" && order.tracking?.tracking_status === "PREPARING_ORDER" && (
                        <>
                            <p className="text-lg font-bold">Order confirmed</p>
                            <p className="text-muted-foreground mb-4">The order was just marked as confirmed. You should start packing the order!</p>
                            <OrderReadyButton order={order} />
                        </>
                    )}
                    {order.status === "READY" && order.tracking?.tracking_status === "WAITING_FOR_PICKUP" && (
                        <>
                            <p className="text-lg font-bold">Ready for pickup</p>
                            <p className="text-muted-foreground mb-4">The order is at store waiting for the customer to pick it up. You should contact the customer if it&apos;s been more than 10 minutes and the order hasn&apos;t been picked up.</p>
                            <FinalizeOrderButton order={order} />
                        </>
                    )}
                    {order.status === "READY" && order.tracking?.tracking_status === "WAITING_FOR_DELIVERY" && (
                        <>
                            <p className="text-lg font-bold">Ready for delivery</p>
                            <p className="text-muted-foreground mb-4">The store is waiting for the delivery driver to pick up the order. You should contact the delivery driver if it&apos;s been more than 10 minutes and the order hasn&apos;t been picked up.</p>
                            <PickedUpOrderButton order={order} />
                        </>
                    )}
                    {order.status === "READY" && order.tracking?.tracking_status === "ON_THE_WAY" && (
                        <>
                            <p className="text-lg font-bold">On the way</p>
                            <p className="text-muted-foreground mb-4">The order is on the way to the customer&apos;s address. You should contact the customer if it&apos;s been more than 15 minutes and the order hasn&apos;t arrived yet.</p>
                            <FinalizeOrderButton order={order} />
                        </>
                    )}
                    {order.status === "COMPLETED" && (
                        <>
                            <p className="text-lg font-bold">Order completed</p>
                            <p className="text-muted-foreground mb-4">The order has been completed. You should contact the customer if they have any issues with the order.</p>
                        </>
                    )}
                </div>
                <CancelOrderButton order={order} slug={order.store.slug} className="w-full" />
            </div>
        </div>
    )
}

export default OrderTimeline