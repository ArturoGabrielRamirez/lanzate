"use client"

import { DynamicStepperTriggerProps } from "@/features/orders/types"
import { InteractiveStepperDescription, InteractiveStepperIndicator, InteractiveStepperTitle, InteractiveStepperTrigger, useStepper } from "@/features/shadcn/components/expansion/interactive-stepper"
import { cn } from "@/lib/utils"

function DynamicStepperTrigger({ config }: DynamicStepperTriggerProps) {
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