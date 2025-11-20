import { Check, Clock, Contact2, MapPin, StoreIcon, Truck } from "lucide-react"

import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { StepIndicatorProps } from "@/features/stores/types"
import { cn } from "@/lib/utils"

export function StepIndicator({ step, currentStep, onStepClick, disabled }: StepIndicatorProps) {

    const { isStepValid } = useCreateStoreContext()

    const icons = {
        1: StoreIcon,
        2: MapPin,
        3: Contact2,
        4: Clock,
        5: Truck,
        6: Check,
    }

    const tooltips = {
        1: "Basic information",
        2: "Address information",
        3: "Contact information",
        4: "Hours information",
        5: "Delivery information",
        6: "Success",
    }

    const isComplete = !!isStepValid[step]
    const isInvalid = step <= 5 && !isComplete
    const isCurrentActive = step === currentStep

    const handleStepClick = () => {
        if (!disabled) {
            onStepClick(step)
        }
    }

    if (isCurrentActive) {
        const Icon = icons[step as keyof typeof icons]
        return (
            <div
                className={cn("aspect-square rounded-full size-8 lg:size-10 flex items-center justify-center cursor-pointer",
                    isInvalid ? "bg-destructive/20" : "bg-muted"
                )}
                onClick={handleStepClick}
            >
                <IconButton
                    icon={Icon}
                    active={isCurrentActive}
                    onClick={handleStepClick}
                    iconClassName={cn(disabled ? "opacity-50" : "")}
                    disabled={disabled}
                    className={cn(
                        isCurrentActive ? "text-primary" : "text-muted-foreground",
                        disabled ? "opacity-50" : ""
                    )}
                />
            </div>
        )
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div
                    className={cn(
                        "aspect-square rounded-full size-6 lg:size-8 flex items-center justify-center text-xs cursor-pointer text-muted-foreground hover:text-primary",
                        isInvalid ? "bg-destructive/20" : "bg-muted",
                        disabled ? "opacity-50" : ""
                    )}
                    onClick={handleStepClick}
                >
                    {isComplete ? (
                        <Check className="size-4" />
                    ) : (
                        step
                    )}
                </div>
            </TooltipTrigger>
            <TooltipContent>
                {disabled ? "You must complete all required previous steps to unlock this step" : tooltips[step as keyof typeof tooltips]}
            </TooltipContent>
        </Tooltip>
    )
}
