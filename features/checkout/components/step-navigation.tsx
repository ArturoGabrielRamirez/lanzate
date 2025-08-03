"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useStepper } from "@/components/expansion/interactive-stepper"

export function StepNavigation() {
    const { currentStep, nextStep, prevStep, hasNext, hasPrev } = useStepper()

    return (
        <div className="flex justify-between pt-4">
            {currentStep > 1 && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                >
                    <ArrowLeft />
                    Previous
                </Button>
            )}
            {hasNext() && (
                <Button
                    type="button"
                    onClick={nextStep}
                    className={currentStep === 1 ? "ml-auto" : ""}
                >
                    Next
                    <ArrowRight />
                </Button>
            )}
        </div>
    )
} 