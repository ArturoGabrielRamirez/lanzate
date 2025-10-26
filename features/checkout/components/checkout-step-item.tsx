"use client"

import { useFormContext } from "react-hook-form"

import { CheckoutStepItemProps } from "@/features/checkout/types"
import { InteractiveStepperDescription, InteractiveStepperIndicator, InteractiveStepperSeparator, InteractiveStepperTitle, InteractiveStepperTrigger } from "@/features/shadcn/components/expansion/interactive-stepper"
import { cn } from "@/lib/utils"

function CheckoutStepItem({ title, description, errorFields = [] }: CheckoutStepItemProps) {
    const { formState: { errors } } = useFormContext()

    const hasErrors = errorFields.some(field => errors[field])

    return (
        <>
            <InteractiveStepperTrigger>
                <InteractiveStepperIndicator
                    className={cn(
                        hasErrors && "border-red-500 bg-red-500 text-white"
                    )}
                />
                <div>
                    <InteractiveStepperTitle>{title}</InteractiveStepperTitle>
                    <InteractiveStepperDescription>{description}</InteractiveStepperDescription>
                </div>
            </InteractiveStepperTrigger>
            <InteractiveStepperSeparator />
        </>
    )
} 

export { CheckoutStepItem }