"use client"

import { InteractiveStepperDescription, InteractiveStepperIndicator, InteractiveStepperTitle, InteractiveStepperTrigger, useStepper } from "@/components/expansion/interactive-stepper"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

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
        icon: Icon,
        iconClassName,
        titleClassName,
        descriptionClassName,
        step
    } = config

    const { currentStep } = useStepper()

    return (
        <InteractiveStepperTrigger className={cn(
            "opacity-50",
            currentStep === step && "opacity-100",
        )}>
            <InteractiveStepperIndicator 
                className={cn(
                    completed && "bg-green-500",
                    iconClassName
                )}
            />
            <div>
                <InteractiveStepperTitle 
                    className={cn(
                        completed && "text-green-500",
                        titleClassName
                    )}
                >
                    {title}
                </InteractiveStepperTitle>
                <InteractiveStepperDescription 
                    className={descriptionClassName}
                >
                    {description}
                </InteractiveStepperDescription>
            </div>
        </InteractiveStepperTrigger>
    )
}

export default DynamicStepperTrigger 