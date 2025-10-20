"use client"

import { InteractiveStepper, InteractiveStepperContent, InteractiveStepperItem, InteractiveStepperSeparator } from "@/features/shadcn/components/expansion/interactive-stepper"
import { StepNavigation } from "@/features/checkout/components/step-navigation"
import OrderDetailsStep from "./order-details-step"
import OrderStatusStep from "./order-status-step"
import CustomerInfoStep from "./customer-info-step"
import DynamicStepperTrigger from "./dynamic-stepper-trigger"
import { Order } from "@prisma/client"
import { Package, Settings, User } from "lucide-react"

type EmployeePermissions = {
    isAdmin: boolean
    permissions?: {
        can_create_orders: boolean
        can_update_orders: boolean
        can_create_products: boolean
        can_update_products: boolean
        can_manage_stock: boolean
        can_process_refunds: boolean
        can_view_reports: boolean
        can_manage_employees: boolean
        can_manage_store: boolean
    }
}

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
    employeePermissions: EmployeePermissions
}

function OrderSummarySteps({ order, employeePermissions }: Props) {
    const isPickup = order.shipping_method === "PICKUP"
    const isCompleted = order.status === "COMPLETED"
    const isCancelled = order.status === "CANCELLED"

    // Determine third step title and description based on completion status
    let thirdStepTitle: string
    let thirdStepDescription: string

    if (isCompleted) {
        if (isPickup) {
            thirdStepTitle = "Order Picked Up"
            thirdStepDescription = "The customer has picked up their order"
        } else {
            thirdStepTitle = "Order Delivered"
            thirdStepDescription = "The order has been delivered to the customer"
        }
    } else {
        thirdStepTitle = isPickup ? "Ready for Pickup" : "Delivery Tracking"
        thirdStepDescription = isPickup ? "The order is ready for pickup" : "Track where the order is"
    }

    // Show full details only for completed or cancelled orders
    const showFullDetails = true

    // Determine which steps should be completed
    const isProcessingCompleted = isCompleted || order.status === "READY" || order.status === "DELIVERED" || order.status === "SHIPPED"
    const isThirdStepCompleted = isCompleted || order.status === "DELIVERED"

    // Configuration for each step trigger
    const stepTriggerConfigs = [
        {
            title: "Order Placed",
            description: "Someone made a new order!",
            completed: true,
            icon: Package,
            step: 1
        },
        {
            title: "Confirm Order",
            description: "Tell the customer their order is ready!",
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

    if (isCancelled) {
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
            <InteractiveStepperItem completed key={0} className="hidden">
                <DynamicStepperTrigger config={stepTriggerConfigs[0]} />
                <InteractiveStepperSeparator />
            </InteractiveStepperItem>

            <InteractiveStepperItem completed={isProcessingCompleted} key={1} className="hidden">
                <DynamicStepperTrigger config={stepTriggerConfigs[1]} />
                <InteractiveStepperSeparator />
            </InteractiveStepperItem>

            <InteractiveStepperItem completed={isThirdStepCompleted} key={2} className="hidden">
                <DynamicStepperTrigger config={stepTriggerConfigs[2]} />
                <InteractiveStepperSeparator />
            </InteractiveStepperItem>

            <InteractiveStepperContent step={1} className="grow flex flex-col" key={0}>
                <StepNavigation />
                <OrderDetailsStep order={order} showFullDetails={showFullDetails} />
                <StepNavigation />
            </InteractiveStepperContent>

            <InteractiveStepperContent step={2} className="grow flex flex-col" key={1}>
                <OrderStatusStep order={order} employeePermissions={employeePermissions} />
                <StepNavigation />
            </InteractiveStepperContent>

            <InteractiveStepperContent step={3} className="grow flex flex-col" key={2}>
                <CustomerInfoStep order={order} employeePermissions={employeePermissions} />
                <StepNavigation />
            </InteractiveStepperContent>
        </InteractiveStepper>
    )
}

export default OrderSummarySteps