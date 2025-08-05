"use client"

import { InteractiveStepper, InteractiveStepperContent, InteractiveStepperItem, InteractiveStepperSeparator } from "@/components/expansion/interactive-stepper"
import { Order } from "@prisma/client"
import { Package, CheckCircle, Truck } from "lucide-react"
import CustomerOrderDetailsStep from "./customer-order-details-step"
import CustomerOrderConfirmationStep from "./customer-order-confirmation-step"
import CustomerOrderTrackingStep from "./customer-order-tracking-step"
import DynamicStepperTrigger from "@/features/orders/components/dynamic-stepper-trigger"
import { StepNavigation } from "@/features/checkout/components/step-navigation"

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
        }
        tracking?: {
            tracking_status: string
        } | null
    }
}

function CustomerOrderTracking({ order }: Props) {
    const isPickup = order.shipping_method === "PICKUP"
    const isCompleted = order.status === "COMPLETED"
    const isCancelled = order.status === "CANCELLED"

    // Determine third step title and description based on completion status
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

    // Determine which steps should be completed
    const isProcessingCompleted = isCompleted || order.status === "READY" || order.status === "DELIVERED" || order.status === "SHIPPED"
    const isThirdStepCompleted = isCompleted || order.status === "DELIVERED"

    // Configuration for each step trigger
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
        <InteractiveStepper orientation="horizontal" className="grow">
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
                <CustomerOrderTrackingStep order={order} />
            </InteractiveStepperContent>
        </InteractiveStepper>
    )
}

export default CustomerOrderTracking 