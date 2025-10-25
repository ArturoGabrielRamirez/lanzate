"use client"

import { ArrowLeft, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

import { useStepper } from "@/features/shadcn/components/expansion/interactive-stepper"
import { Button } from "@/features/shadcn/components/ui/button"

export function StepNavigation() {
    const { currentStep, nextStep, prevStep, hasNext } = useStepper()
    const t = useTranslations("checkout.navigation")

    return (
        <div className="flex justify-between pt-4 w-full">
            {currentStep > 1 && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                >
                    <ArrowLeft />
                    {t("previous")}
                </Button>
            )}
            {hasNext() && (
                <Button
                    type="button"
                    onClick={nextStep}
                    className={currentStep === 1 ? "ml-auto" : ""}
                >
                    {t("next")}
                    <ArrowRight />
                </Button>
            )}
        </div>
    )
} 