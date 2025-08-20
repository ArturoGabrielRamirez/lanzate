"use client"

import { Order } from "@prisma/client"
import { Truck, Clock, CircleCheck, ShoppingBag, MapPin } from "lucide-react"
/* import DynamicStepperTrigger from "@/features/orders/components/dynamic-stepper-trigger"
import { StepNavigation } from "@/features/checkout/components/step-navigation"
import CustomerOrderDetailsStep from "./customer-order-details-step"
import CustomerOrderConfirmationStep from "./customer-order-confirmation-step"
import CustomerOrderTrackingStep from "./customer-order-tracking-step" */
/* import HorizontalEventTimelineCarousel from "@/src/components/horizontal-event-timeline-carousel" */
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { cn } from "@/lib/utils"

type OrderItemWithProduct = {
    id: number
    quantity: number
    price: number
    product: {
        id: number
        name: string
        image: string | null
    }
}

type Props = {
    order: Order & {
        items: OrderItemWithProduct[]
        store: {
            name: string
        }
        branch: {
            name: string
            address: string
        }
        tracking?: {
            tracking_status: string
        } | null
    }
}

/* function CustomerOrderTrackingOld({ order }: Props) {
    const isPickup = order.shipping_method === "PICKUP"
    const isCompleted = order.status === "COMPLETED"
    const isCancelled = order.status === "CANCELLED"

    let thirdStepTitle: string
    let thirdStepDescription: string

    if (isCompleted) {
        if (isPickup) {
            thirdStepTitle = "Order Picked Up"
            thirdStepDescription = "Your order has been successfully picked up"
        } else {
            thirdStepTitle = "Order Delivered"
            thirdStepDescription = "Your order has been delivered successfully"
        }
    } else {
        thirdStepTitle = isPickup ? "Ready for Pickup" : "Delivery Tracking"
        thirdStepDescription = isPickup ? "Your order is ready for pickup" : "Track your order delivery"
    }

    const isProcessingCompleted = isCompleted || order.status === "READY" || order.status === "DELIVERED" || order.status === "SHIPPED"
    const isThirdStepCompleted = isCompleted || order.status === "DELIVERED"

    const stepTriggerConfigs = [
        {
            title: "Order Placed",
            description: "Your order has been received",
            completed: true,
            icon: Package,
            step: 1
        },
        {
            title: "Order Confirmed",
            description: "Your order has been confirmed and is being prepared",
            completed: isProcessingCompleted,
            icon: CheckCircle,
            step: 2
        },
        {
            title: thirdStepTitle,
            description: thirdStepDescription,
            completed: isThirdStepCompleted,
            icon: Truck,
            step: 3
        }
    ]

    if (isCancelled) {
        return (
            <InteractiveStepper orientation="horizontal">
                <InteractiveStepperItem completed>
                    <DynamicStepperTrigger
                        config={{
                            title: "Order Cancelled",
                            description: "This order has been cancelled",
                            completed: true
                        }}
                    />
                </InteractiveStepperItem>
                <InteractiveStepperContent step={1}>
                    <CustomerOrderDetailsStep order={order} />
                </InteractiveStepperContent>
            </InteractiveStepper>
        )
    }

    return (
        <InteractiveStepper orientation="horizontal" className="grow" defaultValue={
            isCompleted ? 1 : isProcessingCompleted ? 3 : 2
        }>
            <InteractiveStepperItem completed>
                <DynamicStepperTrigger config={stepTriggerConfigs[0]} />
                <InteractiveStepperSeparator />
            </InteractiveStepperItem>

            <InteractiveStepperItem completed={isProcessingCompleted}>
                <DynamicStepperTrigger config={stepTriggerConfigs[1]} />
                <InteractiveStepperSeparator />
            </InteractiveStepperItem>

            <InteractiveStepperItem completed={isThirdStepCompleted} disabled={!isProcessingCompleted}>
                <DynamicStepperTrigger config={stepTriggerConfigs[2]} />
            </InteractiveStepperItem>

            <InteractiveStepperContent step={1} className="grow flex flex-col">
                <StepNavigation />
                <CustomerOrderDetailsStep order={order} />
                <StepNavigation />
            </InteractiveStepperContent>

            <InteractiveStepperContent step={2} className="grow flex flex-col">
                <StepNavigation />
                <CustomerOrderConfirmationStep order={order} />
                <StepNavigation />
            </InteractiveStepperContent>

            <InteractiveStepperContent step={3} className="grow flex flex-col">
                <StepNavigation />
                <CustomerOrderTrackingStep order={order} />
                <StepNavigation />
            </InteractiveStepperContent>
        </InteractiveStepper>
    )
} */

function CustomerOrderTracking({ order }: Props) {



    return (
        <div>
            <div className="flex items-center gap-2">
                <IconButton
                    className={cn("text-muted-foreground", order.status === "PROCESSING" && "text-accent")}
                    icon={() => <Clock />}
                />
                <div className="w-10 h-1 bg-muted" />
                <IconButton
                    className={cn("text-muted-foreground", order.status === "READY" && "text-accent")}
                    icon={() => <CircleCheck />}
                />
                <div className="w-10 h-1 bg-muted" />
                <IconButton
                    className={cn("text-muted-foreground", order.status === "READY" && order.tracking?.tracking_status === "PREPARING_ORDER" && "text-accent")}
                    icon={() => <ShoppingBag />}
                />
                <div className="w-10 h-1 bg-muted" />
                {order.shipping_method === "PICKUP" && (
                    <>
                        <IconButton
                            className={cn("text-muted-foreground", order.tracking?.tracking_status === "WAITING_FOR_PICKUP" && "text-accent")}
                            icon={() => <MapPin />}
                        />
                    </>
                )}
                {order.shipping_method === "DELIVERY" && (
                    <>
                        <IconButton
                            className={cn("text-muted-foreground", order.tracking?.tracking_status === "ON_THE_WAY" && "text-accent")}
                            icon={() => <Truck />}
                        />
                    </>
                )}
            </div>
        </div>
    )
}

export default CustomerOrderTracking 