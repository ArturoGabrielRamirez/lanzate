"use client"

import { Package, Settings, User } from "lucide-react"

import { StepNavigation } from "@/features/checkout/components/step-navigation"
import { CustomerInfoStep } from "@/features/orders/components"
import { DynamicStepperTrigger } from "@/features/orders/components/dynamic-stepper-trigger"
import { OrderDetailsStep } from "@/features/orders/components/order-details-step"
import { OrderStatusStep } from "@/features/orders/components/order-status-step"
import { OrderSummaryStepsProps } from "@/features/orders/types"
import { InteractiveStepper, InteractiveStepperContent, InteractiveStepperItem, InteractiveStepperSeparator } from "@/features/shadcn/components/expansion/interactive-stepper"

function OrderSummarySteps({ order, employeePermissions }: OrderSummaryStepsProps) {
    const isPickup = order.shipping_method === "PICKUP"
    const isCompleted = order.status === "COMPLETED"
    const isCancelled = order.status === "CANCELLED"

    // Determine third step title and description based on completion status
    let thirdStepTitle: string
    let thirdStepDescription: string

    if (isCompleted) {
        if (isPickup) {
            thirdStepTitle = "Pedido Retirado"
            thirdStepDescription = "El cliente retiró su pedido"
        } else {
            thirdStepTitle = "Pedido Entregado"
            thirdStepDescription = "El pedido fue entregado al cliente"
        }
    } else {
        thirdStepTitle = isPickup ? "Listo para Retirar" : "Seguimiento de Entrega"
        thirdStepDescription = isPickup ? "El pedido está listo para retirar" : "Seguimiento de dónde está el pedido"
    }

    // Show full details only for completed or cancelled orders
    const showFullDetails = true

    // Determine which steps should be completed
    const isProcessingCompleted = isCompleted || order.status === "READY" || order.status === "DELIVERED" || order.status === "SHIPPED"
    const isThirdStepCompleted = isCompleted || order.status === "DELIVERED"

    // Configuration for each step trigger
    const stepTriggerConfigs = [
        {
            title: "Pedido Realizado",
            description: "¡Alguien hizo un nuevo pedido!",
            completed: true,
            icon: Package,
            step: 1
        },
        {
            title: "Confirmar Pedido",
            description: "Informá al cliente que su pedido está listo",
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
                            title: "Pedido Completado",
                            description: "Este pedido ha sido completado con éxito",
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

export { OrderSummarySteps }