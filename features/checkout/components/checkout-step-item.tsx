"use client"

import { InteractiveStepperDescription, InteractiveStepperIndicator, InteractiveStepperSeparator, InteractiveStepperTitle, InteractiveStepperTrigger } from "@/components/expansion/interactive-stepper"
import { useFormContext } from "react-hook-form"
import { cn } from "@/lib/utils"

interface CheckoutStepItemProps {
    step: number
    title: string
    description: string
    errorFields?: string[]
}

export function CheckoutStepItem({ step, title, description, errorFields = [] }: CheckoutStepItemProps) {
    const { formState: { errors } } = useFormContext()

    // Check if any of the error fields have errors
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