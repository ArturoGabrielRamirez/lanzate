"use client"

import { InteractiveStepper, InteractiveStepperContent, InteractiveStepperDescription, InteractiveStepperIndicator, InteractiveStepperItem, InteractiveStepperSeparator, InteractiveStepperTitle, InteractiveStepperTrigger } from "@/components/expansion/interactive-stepper"
import { StepNavigation } from "@/features/checkout/components/step-navigation"
import OrderDetailsStep from "./order-details-step"
import OrderStatusStep from "./order-status-step"
import CustomerInfoStep from "./customer-info-step"

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

type Order = {
    id: number
    created_at: Date
    shipping_method: "PICKUP" | "DELIVERY" 
    status: "PENDING" | "PROCESSING" | "READY" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "COMPLETED"
    customer_name: string | null
    customer_email: string | null
    customer_phone: string | null
    address_one?: string | null
    address_two?: string | null
    city?: string | null
    state?: string | null
    zip_code?: string | null
    country?: string | null
    total_price: number
    total_quantity: number
    branch: {
        name: string
        address: string
    } | null
    items: OrderItemWithProduct[]
    payment: {
        amount: number
        status: "PENDING" | "PAID"
    }
    created_by_employee?: {
        user?: {
            first_name: string | null
            last_name: string | null
            email: string
        }
    } | null
    updated_by_employee?: {
        user?: {
            first_name: string | null
            last_name: string | null
            email: string
        }
    } | null
}

type Props = {
    order: Order
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

    if (isCompleted || isCancelled) {
        return (
            <InteractiveStepper orientation="horizontal">
                <InteractiveStepperItem completed>
                    <InteractiveStepperTrigger>
                        <InteractiveStepperIndicator />
                        <div>
                            <InteractiveStepperTitle>Order Completed</InteractiveStepperTitle>
                            <InteractiveStepperDescription>
                                This order has been completed successfully
                            </InteractiveStepperDescription>
                        </div>
                    </InteractiveStepperTrigger>
                </InteractiveStepperItem>
                <InteractiveStepperContent step={1}>
                    <OrderDetailsStep order={order} showFullDetails={true} />
                </InteractiveStepperContent>
            </InteractiveStepper>
        )
    }

    return (
        <InteractiveStepper orientation="horizontal">
            <InteractiveStepperItem completed>
                <InteractiveStepperTrigger>
                    <InteractiveStepperIndicator />
                    <div>
                        <InteractiveStepperTitle>Order Placed</InteractiveStepperTitle>
                        <InteractiveStepperDescription>
                            Your order has been placed successfully
                        </InteractiveStepperDescription>
                    </div>
                </InteractiveStepperTrigger>
                <InteractiveStepperSeparator />
            </InteractiveStepperItem>
            <InteractiveStepperItem completed={isProcessingCompleted}>
                <InteractiveStepperTrigger>
                    <InteractiveStepperIndicator />
                    <div>
                        <InteractiveStepperTitle>Processing</InteractiveStepperTitle>
                        <InteractiveStepperDescription>
                            We are preparing your order
                        </InteractiveStepperDescription>
                    </div>
                </InteractiveStepperTrigger>
                <InteractiveStepperSeparator />
            </InteractiveStepperItem>
            <InteractiveStepperItem completed={isThirdStepCompleted}>
                <InteractiveStepperTrigger>
                    <InteractiveStepperIndicator />
                    <div>
                        <InteractiveStepperTitle>{thirdStepTitle}</InteractiveStepperTitle>
                        <InteractiveStepperDescription>{thirdStepDescription}</InteractiveStepperDescription>
                    </div>
                </InteractiveStepperTrigger>
                <InteractiveStepperSeparator />
            </InteractiveStepperItem>
            
            <InteractiveStepperContent step={1}>
                <OrderDetailsStep order={order} showFullDetails={showFullDetails} />
                {!showFullDetails && <StepNavigation />}
            </InteractiveStepperContent>
            
            <InteractiveStepperContent step={2}>
                <OrderStatusStep order={order} />
                <StepNavigation />
            </InteractiveStepperContent>
            
            <InteractiveStepperContent step={3}>
                <CustomerInfoStep order={order} />
                <StepNavigation />
            </InteractiveStepperContent>
        </InteractiveStepper>
    )
}

export default OrderSummarySteps