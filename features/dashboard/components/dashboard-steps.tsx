"use client"

import { Store, ShoppingCart, Settings, Share2, ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useTranslations } from "next-intl"
import { useState, useRef, useEffect, useCallback } from "react"

import { CreateProductForStoreButton, ConfigureStoreOperationsButton, ShareStoreLink, DashboardStepCard } from "@/features/dashboard/components"
/* import { CreateStoreButton } from "@/features/stores/components" */
import { StepStatus, DashboardStepsProps } from "@/features/dashboard/types"
import CreateStoreButtonNew from "@/features/stores/components/create-store-button-new"

function DashboardSteps({ userId, dashboardData }: DashboardStepsProps) {
    const t = useTranslations("dashboard")
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [containerHeight, setContainerHeight] = useState<number>(400)
    const cardRef = useRef<HTMLDivElement>(null)

    const hasStores = dashboardData.storeCount > 0
    const hasProducts = dashboardData.productCount > 0
    const hasOperationalSettings = dashboardData.operationalSettingsCount > 0

    // Determine step statuses
    const step1Status: StepStatus = hasStores ? 'complete' : 'active'
    const step2Status: StepStatus = !hasStores ? 'disabled' : (hasProducts ? 'complete' : 'active')
    const step3Status: StepStatus = !hasProducts ? 'disabled' : (hasOperationalSettings ? 'complete' : 'active')
    const step4Status: StepStatus = !hasOperationalSettings ? 'disabled' : 'active'

    // Create array of all steps
    const steps = [
        {
            stepNumber: 1,
            title: t("step-1.create-a-new-store"),
            description: t("step-1.to-continue"),
            icon: Store,
            status: step1Status,
            footer: !hasStores ? (
                <>
                    {/* <CreateStoreButton userId={userId} /> */}
                    <CreateStoreButtonNew userId={userId} />
                </>
            ) : (
                <p className="text-sm text-muted-foreground">
                    {t("step-1.stores-created", {
                        count: dashboardData.storeCount,
                        plural: dashboardData.storeCount > 1 ? t("step-1.stores") : t("step-1.store")
                    })}
                </p>
            ),
            children: null
        },
        {
            stepNumber: 2,
            title: t("step-2.create-a-product"),
            description: t("step-2.to-continue"),
            icon: ShoppingCart,
            status: step2Status,
            footer: hasStores && !hasProducts ? (
                <CreateProductForStoreButton
                    userId={userId}
                    stores={dashboardData.stores}
                />
            ) : undefined,
            children: (
                <div>
                    {!hasStores && (
                        <div className="mt-2 md:mt-3 lg:mt-4 text-xs text-amber-600 bg-amber-50 p-1 md:p-2 rounded">
                            {t("step-2.first-complete")}
                        </div>
                    )}
                    {hasProducts && (
                        <div className="mt-2 text-xs text-green-600 bg-green-50 p-2 rounded">
                            {t("step-2.products-created", {
                                count: dashboardData.productCount,
                                plural: dashboardData.productCount > 1 ? t("step-2.products") : t("step-2.product")
                            })}
                        </div>
                    )}
                </div>
            )
        },
        {
            stepNumber: 3,
            title: t("step-3.configure-operations"),
            description: t("step-3.to-continue"),
            icon: Settings,
            status: step3Status,
            footer: hasProducts && !hasOperationalSettings ? (
                <ConfigureStoreOperationsButton
                    userId={userId}
                    stores={dashboardData.stores}
                />
            ) : undefined,
            children: (
                <div>
                    {!hasProducts && (
                        <div className="mt-2 md:mt-3 lg:mt-4 text-xs text-amber-600 bg-amber-50 p-1 md:p-2 rounded">
                            {t("step-3.first-complete")}
                        </div>
                    )}
                    {hasOperationalSettings && (
                        <div className="mt-2 text-xs text-green-600 bg-green-50 p-2 rounded">
                            {t("step-3.operations-configured", {
                                count: dashboardData.operationalSettingsCount,
                                plural: dashboardData.operationalSettingsCount > 1 ? t("step-3.stores") : t("step-3.store")
                            })}
                        </div>
                    )}
                </div>
            )
        },
        {
            stepNumber: 4,
            title: t("step-4.share-your-store"),
            description: t("step-4.share-your-store-with"),
            icon: Share2,
            status: step4Status,
            footer: hasOperationalSettings ? (
                <ShareStoreLink stores={dashboardData.stores} />
            ) : undefined,
            children: !hasOperationalSettings ? (
                <div className="mt-2 md:mt-3 lg:mt-4 text-xs text-amber-600 bg-amber-50 p-1 md:p-2 rounded">
                    {t("step-4.first-complete")}
                </div>
            ) : null
        }
    ]

    // Function to measure and update height
    const measureHeight = useCallback(() => {
        if (cardRef.current) {
            // Wait for next tick to ensure DOM is updated
            setTimeout(() => {
                if (cardRef.current) {
                    const height = cardRef.current.offsetHeight
                    setContainerHeight(height)
                }
            }, 0)
        }
    }, [])

    // Update container height when step changes
    useEffect(() => {
        measureHeight()
    }, [currentStepIndex, measureHeight])

    const goToNextStep = () => {
        setCurrentStepIndex((prev) => (prev + 1) % steps.length)
    }

    const goToPrevStep = () => {
        setCurrentStepIndex((prev) => (prev - 1 + steps.length) % steps.length)
    }

    const currentStep = steps[currentStepIndex]

    return (
        <div className="relative group">
            {/* Navigation Buttons */}
            <button
                onClick={goToPrevStep}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white shadow-lg border opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50 cursor-pointer"
            >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <button
                onClick={goToNextStep}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white shadow-lg border opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50 cursor-pointer"
            >
                <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>

            {/* Step indicator dots */}
            {/* <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                {steps.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentStepIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentStepIndex 
                                ? 'bg-primary' 
                                : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                    />
                ))}
            </div> */}

            {/* Stacked Cards Container */}
            <motion.div
                className="relative w-full overflow-hidden"
                animate={{ height: containerHeight }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStepIndex}
                        ref={cardRef}
                        initial={{ opacity: 0, x: 300, rotateY: 45 }}
                        animate={{ opacity: 1, x: 0, rotateY: 0 }}
                        exit={{ opacity: 0, x: -300, rotateY: -45 }}
                        transition={{
                            duration: 0.4,
                            ease: [0.4, 0, 0.2, 1]
                        }}
                        className="w-full"
                        style={{ perspective: '1000px' }}
                        onAnimationComplete={() => {
                            // Measure height after animation completes
                            measureHeight()
                        }}
                    >
                        <DashboardStepCard
                            stepNumber={currentStep.stepNumber}
                            title={currentStep.title}
                            description={currentStep.description}
                            icon={currentStep.icon}
                            status={currentStep.status}
                            footer={currentStep.footer}
                            cardClassName="shadow-xl"
                        >
                            {currentStep.children}
                        </DashboardStepCard>
                    </motion.div>
                </AnimatePresence>

                {/* Background stacked cards for depth effect */}
                {/* <div className="absolute inset-0 -z-10 pointer-events-none">
                    <div className="absolute inset-0 bg-white border rounded-lg shadow-md transform translate-x-2 translate-y-2 opacity-30" />
                    <div className="absolute inset-0 bg-white border rounded-lg shadow-sm transform translate-x-4 translate-y-4 opacity-15" />
                </div> */}
            </motion.div>
        </div>
    )
}

export { DashboardSteps }