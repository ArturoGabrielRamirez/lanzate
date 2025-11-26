"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

import shareStoreImage from "@/features/dashboard/assets/Ecommerce web page-pana.svg"
import createStoreImage from "@/features/dashboard/assets/fashion shop-pana.svg"
import createProductImage from "@/features/dashboard/assets/Niche service marketplace-pana.svg"
import welcomeImage from "@/features/dashboard/assets/we are open-pana.svg"
import { WelcomeTutorialWidget } from "@/features/dashboard/components/welcome-tutorial"
import { Button } from "@/features/shadcn/components/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/features/shadcn/components/ui/dialog"
import { useStep } from "@/features/shadcn/hooks/use-step"
import { SectionContainer } from "@/features/stores/components"
import { CreateStoreButton } from "@/features/stores/components/create-form/create-store-button"

function WelcomeTutorial({ userId }: { userId: number }) {

    const t = useTranslations("dashboard.welcome-tutorial")
    const [open, setOpen] = useState(false)
    const [currentStep, { goToNextStep, goToPrevStep, setStep }] = useStep(4)

    const images = [welcomeImage, createStoreImage, createProductImage, shareStoreImage]
    
    const getStepTexts = (step: number) => {
        const stepKey = step.toString() as "1" | "2" | "3" | "4"
        return {
            title: t(`steps.${stepKey}.title`),
            descriptions: [
                t(`steps.${stepKey}.descriptions.0`),
                t(`steps.${stepKey}.descriptions.1`),
                ...(step === 4 ? [t(`steps.${stepKey}.descriptions.2`)] : [])
            ]
        }
    }

    useEffect(() => {
        const tutorialFinished = localStorage.getItem("tutorial-finished")
        if (tutorialFinished) {
            setOpen(false)
        } else {
            setOpen(true)
        }
        
    }, [])

    const handleFinishTutorial = () => {
        setOpen(false)
        localStorage.setItem("tutorial-finished", "true")
    }

    const handleRetakeTutorial = () => {
        localStorage.removeItem("tutorial-finished")
        setOpen(true)
        setStep(1)
    }

    const currentTexts = getStepTexts(currentStep)

    return (
        <SectionContainer title={t("section-title")}>
            <WelcomeTutorialWidget onRetakeTutorial={handleRetakeTutorial} />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="w-full !max-w-full h-full md:!max-w-lg md:h-auto rounded-none md:!rounded-lg">
                    <DialogHeader>
                        <DialogTitle>{t("dialog-title")}</DialogTitle>
                    </DialogHeader>

                    <div className="text-center md:text-left">
                        <div className="relative w-full aspect-video my-8">
                            <Image src={images[currentStep - 1]} alt={t("alt-image")} fill objectFit="cover" unoptimized={true} />
                        </div>
                        <p className="text-3xl font-bold mb-6">
                            {currentTexts.title}
                        </p>
                        {currentTexts.descriptions.map((description, index) => (
                            <p key={index} className="mb-2 text-balance text-muted-foreground">
                                {description}
                            </p>
                        ))}
                        {currentStep === 2 && (
                            <div className="mt-6 flex justify-center md:justify-start">
                                <CreateStoreButton userId={userId} />
                            </div>
                        )}
                    </div>

                    <DialogFooter className="!flex-col justify-end md:!flex-row">
                        {currentStep > 1 && (
                            <Button onClick={goToPrevStep} variant="secondary">
                                {t("buttons.previous")}
                            </Button>
                        )}
                        {currentStep < 4 && (
                            <Button onClick={goToNextStep}>
                                {t("buttons.next")}
                            </Button>
                        )}
                        {currentStep === 4 && (
                            <Button onClick={handleFinishTutorial}>
                                {t("buttons.finish")}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </SectionContainer>
    )

}

export { WelcomeTutorial }