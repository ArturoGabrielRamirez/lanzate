"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useStepper } from "@/components/expansion/interactive-stepper"
import { useTranslations } from "next-intl"

export function StepNavigation() {
    const { currentStep, nextStep, prevStep, hasNext } = useStepper()
    const t = useTranslations("checkout.navigation")

    return (
        <div className="flex justify-between pt-4">
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