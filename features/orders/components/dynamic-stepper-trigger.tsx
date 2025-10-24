"use client"

import { LucideIcon } from "lucide-react"

import { InteractiveStepperDescription, InteractiveStepperIndicator, InteractiveStepperTitle, InteractiveStepperTrigger, useStepper } from "@/features/shadcn/components/expansion/interactive-stepper"
import { cn } from "@/lib/utils"

type StepperTriggerConfig = {
    title: string
    description: string
    completed?: boolean
    icon?: LucideIcon
    iconClassName?: string
    titleClassName?: string
    descriptionClassName?: string
    step?: number
}

type Props = {
    config: StepperTriggerConfig
}

function DynamicStepperTrigger({ config }: Props) {
    const {
        title,
        description,
        completed = false,
        iconClassName,
        titleClassName,
        descriptionClassName,
        step
    } = config

    const { currentStep } = useStepper()

    return (
        <InteractiveStepperTrigger className={cn(
            "opacity-50 scale-75 transition-all duration-300",
            currentStep === step && "opacity-100 scale-100",
            "flex flex-col gap-2 md:gap-2 justify-center"
        )}>
            <InteractiveStepperIndicator 
                className={cn(
                    currentStep === step && "animate-ping-custom",
                    completed && "bg-green-500",
                    iconClassName
                )}
            />
            <div>
                <InteractiveStepperTitle 
                    className={cn(
                        "text-center",
                        completed && "text-green-500",
                        titleClassName
                    )}
                >
                    {title}
                </InteractiveStepperTitle>
                <InteractiveStepperDescription 
                    className={cn(
                        "text-center hidden md:block",
                        descriptionClassName
                    )}
                >
                    {description}
                </InteractiveStepperDescription>
            </div>
        </InteractiveStepperTrigger>
    )
}

export { DynamicStepperTrigger }