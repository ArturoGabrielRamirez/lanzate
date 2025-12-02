import { Check, Box, ImageIcon, DollarSign, Settings, Package } from "lucide-react"
import { useTranslations } from "next-intl"

import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { cn } from "@/lib/utils"

export interface ProductStepIndicatorProps {
    step: number
    currentStep: number
    onStepClick: (step: number) => void
    disabled: boolean
}

export function StepIndicator({ step, currentStep, onStepClick, disabled }: ProductStepIndicatorProps) {

    const { isStepValid } = useCreateProductContext()
    const t = useTranslations("store.create-product")

    const icons = {
        1: Box,
        2: ImageIcon,
        3: DollarSign,
        4: DollarSign,
        5: Package,
        6: Settings,
        7: Check,
    }

    const tooltips = {
        1: "Información básica",
        2: "Imágenes y multimedia",
        3: "Opciones y variantes",
        4: "Precio y stock",
        5: "Configuración por tipo",
        6: "Configuraciones",
        7: "Finalizar",
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
                {isComplete && step !== 7 ? (
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

