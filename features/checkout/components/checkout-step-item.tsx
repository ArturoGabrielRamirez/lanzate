"use client"

import { InteractiveStepperDescription, InteractiveStepperIndicator, InteractiveStepperSeparator, InteractiveStepperTitle, InteractiveStepperTrigger } from "@/features/shadcn/components/expansion/interactive-stepper"
import { useFormContext } from "react-hook-form"
import { cn } from "@/lib/utils"

interface CheckoutStepItemProps {
    step: number
    title: string
    description: string
    errorFields?: string[]
}

export function CheckoutStepItem({ title, description, errorFields = [] }: CheckoutStepItemProps) {
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