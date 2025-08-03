"use client"

import { InteractiveStepper, InteractiveStepperContent, InteractiveStepperItem, InteractiveStepperSeparator } from "@/components/expansion/interactive-stepper"
import { StepNavigation } from "@/features/checkout/components/step-navigation"
import OrderDetailsStep from "./order-details-step"
import OrderStatusStep from "./order-status-step"
import CustomerInfoStep from "./customer-info-step"
import DynamicStepperTrigger from "./dynamic-stepper-trigger"
import { Order } from "@prisma/client"
import { Package, Settings, User } from "lucide-react"

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
        payment: {
            status: "PENDING" | "PAID"
        }
    }
}

function OrderSummarySteps({ order }: Props) {
    const isPickup = order.shipping_method === "PICKUP"
    const isCompleted = order.status === "COMPLETED"
    const isCancelled = order.status === "CANCELLED"
    const thirdStepTitle = isPickup ? "Ready for Pickup" : "Shipped"
    const thirdStepDescription = isPickup ? "Your order is ready for pickup" : "Your order is on the way"

    // Show full details only for completed or cancelled orders
    const showFullDetails = isCompleted || isCancelled

    // Determine which steps should be completed
    const isProcessingCompleted = isCompleted || order.status === "READY" || order.status === "DELIVERED" || order.status === "SHIPPED"
    const isThirdStepCompleted = isCompleted || order.status === "DELIVERED"

    // Configuration for each step trigger
    const stepTriggerConfigs = [
        {
            title: "Order Details",
            description: "What has been ordered",
            completed: true,
            icon: Package,
            step: 1
        },
        {
            title: "Order Status",
            description: "The status of the order",
            completed: isProcessingCompleted,
            icon: Settings,
            step: 2
        },
        {
            title: thirdStepTitle,
            description: thirdStepDescription,
            completed: isThirdStepCompleted,
            icon: User,
            step: 3
        }
    ]

    if (isCompleted || isCancelled) {
        return (
            <InteractiveStepper orientation="horizontal">
                <InteractiveStepperItem completed>
                    <DynamicStepperTrigger 
                        config={{
                            title: "Order Completed",
                            description: "This order has been completed successfully",
                            completed: true
                        }}
                    />
                </InteractiveStepperItem>
                <InteractiveStepperContent step={1}>
                    <OrderDetailsStep order={order} showFullDetails={true} />
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
            
            <InteractiveStepperItem completed={isThirdStepCompleted} disabled={order.status !== "READY"}>
                <DynamicStepperTrigger config={stepTriggerConfigs[2]} />
                <InteractiveStepperSeparator />
            </InteractiveStepperItem>

            <InteractiveStepperContent step={1} className="grow flex flex-col">
                <OrderDetailsStep order={order} showFullDetails={showFullDetails} />
                {!showFullDetails && <StepNavigation />}
            </InteractiveStepperContent>

            <InteractiveStepperContent step={2} className="grow flex flex-col">
                <OrderStatusStep order={order} />
                <StepNavigation />
            </InteractiveStepperContent>

            <InteractiveStepperContent step={3} className="grow flex flex-col">
                <CustomerInfoStep order={order} />
                <StepNavigation />
            </InteractiveStepperContent>
        </InteractiveStepper>
    )
}

export default OrderSummarySteps