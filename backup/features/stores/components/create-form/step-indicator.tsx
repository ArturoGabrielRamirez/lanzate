import { Check, Clock, Contact2, DollarSign, MapPin, StoreIcon, Truck } from "lucide-react"
import { useTranslations } from "next-intl"

import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { StepIndicatorProps } from "@/features/stores/types"
import { cn } from "@/lib/utils"

export function StepIndicator({ step, currentStep, onStepClick, disabled }: StepIndicatorProps) {

    const { isStepValid } = useCreateStoreContext()
    const t = useTranslations("store.create-form")

    const icons = {
        1: StoreIcon,
        2: Contact2,
        3: DollarSign,
        4: MapPin,
        5: Clock,
        6: Truck,
        7: Check,
    }

    const tooltips = {
        1: t("step-tooltips.basic"),
        2: t("step-tooltips.contact"),
        3: "Información de pago",
        4: t("step-tooltips.address"),
        5: "Información de horarios",
        6: "Información de entrega",
        7: "Éxito",
    }

    const isComplete = !!isStepValid[step]
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
                    "bg-muted"
                )}
                onClick={handleStepClick}
            >
                {isComplete ? (
                    <Check className="size-5 text-primary" />
                ) : (
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
                )}
            </div>
        )
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div
                    className={cn(
                        "aspect-square rounded-full size-3 lg:size-5 flex items-center justify-center text-xs cursor-pointer text-muted-foreground hover:text-primary",
                        "bg-muted",
                        disabled ? "opacity-50" : ""
                    )}
                    onClick={handleStepClick}
                >
                    {isComplete ? (
                        <Check className="size-3 hidden md:block" />
                    ) : (
                        null
                    )}
                </div>
            </TooltipTrigger>
            <TooltipContent>
                {disabled ? t("step-locked") : tooltips[step as keyof typeof tooltips]}
            </TooltipContent>
        </Tooltip>
    )
}
