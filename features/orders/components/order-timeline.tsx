"use client"

import { useStep } from "@/hooks/use-step"
import { cn } from "@/lib/utils"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { Order, OrderItem, OrderPayment, OrderTracking, Product } from "@prisma/client"
import { CircleCheck, Clock, MapPin, ShoppingBag, Truck } from "lucide-react"
import ConfirmOrderButton from "./confirm-order-button"
import OrderReadyButton from "./order-ready-button"

type Props = {
    order: Order & { tracking: OrderTracking | null, items: (OrderItem & { product: Product })[] } & { payment: OrderPayment }
}

const OrderTimeline = ({ order }: Props) => {

    const [currentStep, actions] = useStep(4)
    console.log("🚀 ~ OrderTimeline ~ currentStep:", currentStep)
    console.log("🚀 ~ OrderTimeline ~ order:", order)

    return (
        <div>
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
                <IconButton
                    size={order.status === "READY" && order.tracking?.tracking_status === "WAITING_FOR_PICKUP" ? "lg" : "md"}
                    icon={() => {
                        if (order.shipping_method === "DELIVERY") {
                            return <Truck className={cn("text-muted-foreground/50 size-5", order.tracking?.tracking_status === "WAITING_FOR_DELIVERY" && "text-primary size-6 animate-pulse")} />
                        } else {
                            return <MapPin className={cn("text-muted-foreground/50 size-5", order.tracking?.tracking_status === "WAITING_FOR_PICKUP" && "text-primary size-6 animate-pulse")} />
                        }
                    }}
                />
            </div>
            <div>
                {order.status === "PROCESSING" && (
                    <>
                        <p>A new order was placed.</p>
                        <p>Check you have enough in-store stock and confirm the order!</p>
                        <ConfirmOrderButton order={order} canUpdateOrders={true} />
                    </>
                )}
                {order.status === "READY" && order.tracking?.tracking_status === "PREPARING_ORDER" && (
                    <>
                        <p>The order was marked as confirmed.</p>
                        <p>You should start packing the order!</p>
                        <OrderReadyButton order={order} />
                    </>
                )}
                {order.status === "READY" && order.tracking?.tracking_status === "WAITING_FOR_PICKUP" && (
                    <>
                        <p>The order is at store waiting for the customer to pick it up.</p>
                        <p>You should contact the customer if it&apos;s been more than 10 minutes and the order hasn&apos;t been picked up.</p>
                    </>
                )}
            </div>
        </div>
    )
}

export default OrderTimeline