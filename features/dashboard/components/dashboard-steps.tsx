"use client"

import { Store, ShoppingCart, Settings, Share2 } from "lucide-react"
import DashboardStepCard from "./dashboard-step-card"
import ShareStoreLink from "./share-store-link"
import { CreateStoreButton } from "@/features/stores/components"
import { CreateProductForStoreButton, ConfigureStoreOperationsButton } from "@/features/dashboard/components"
import { DashboardStoreStats } from "../types/types"
import { useTranslations } from "next-intl"

type DashboardStepsProps = {
    userId: number
    dashboardData: DashboardStoreStats
}

function DashboardSteps({ userId, dashboardData }: DashboardStepsProps) {
    const t = useTranslations("dashboard")
    
    const hasStores = dashboardData.storeCount > 0
    const hasProducts = dashboardData.productCount > 0
    const hasOperationalSettings = dashboardData.operationalSettingsCount > 0

    // Check if all previous steps are complete
    const allPreviousStepsComplete = hasStores && hasProducts && hasOperationalSettings

    // Determine step statuses
    const step1Status = hasStores ? 'complete' : 'active'
    const step2Status = !hasStores ? 'disabled' : (hasProducts ? 'complete' : 'active')
    const step3Status = !hasProducts ? 'disabled' : (hasOperationalSettings ? 'complete' : 'active')
    const step4Status = !hasOperationalSettings ? 'disabled' : 'active'

    // If all previous steps are complete, only show step 4
    if (allPreviousStepsComplete) {
        return (
            <div className="">
                {/* <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-green-700 mb-2">🎉 Setup Complete!</h2>
                    <p className="text-muted-foreground">
                        Your store is ready! Now you can share it with your customers.
                    </p>
                </div> */}
                <DashboardStepCard
                    stepNumber={4}
                    title={t("step-4.share-your-store")}
                    description={t("step-4.share-your-store-with")}
                    icon={Share2}
                    status={step4Status}
                    footer={<ShareStoreLink stores={dashboardData.stores} />}
                    cardClassName="md:grid md:grid-cols-[300px_auto_1fr]"
                />
            </div>
        )
    }

    // Show all steps if not all are complete
    return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-4">
            {/* Step 1: Create Store */}
            <DashboardStepCard
                stepNumber={1}
                title={t("step-1.create-a-new-store")}
                description={t("step-1.to-continue")}
                icon={Store}
                status={step1Status}
                footer={
                    !hasStores ? (
                        <CreateStoreButton userId={userId} />
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            {t("step-1.stores-created", { 
                                count: dashboardData.storeCount,
                                plural: dashboardData.storeCount > 1 ? t("step-1.stores") : t("step-1.store")
                            })}
                        </p>
                    )
                }
            >
                {/* No additional content for step 1 */}
            </DashboardStepCard>

            {/* Step 2: Create Product */}
            <DashboardStepCard
                stepNumber={2}
                title={t("step-2.create-a-product")}
                description={t("step-2.to-continue")}
                icon={ShoppingCart}
                status={step2Status}
                footer={
                    hasStores && !hasProducts ? (
                        <CreateProductForStoreButton 
                            userId={userId} 
                            stores={dashboardData.stores}
                        />
                    ) : undefined
                }
            >
                {!hasStores && (
                    <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
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
            </DashboardStepCard>

            {/* Step 3: Configure Operations */}
            <DashboardStepCard
                stepNumber={3}
                title={t("step-3.configure-operations")}
                description={t("step-3.to-continue")}
                icon={Settings}
                status={step3Status}
                footer={
                    hasProducts && !hasOperationalSettings ? (
                        <ConfigureStoreOperationsButton 
                            userId={userId} 
                            stores={dashboardData.stores}
                        />
                    ) : undefined
                }
            >
                {!hasProducts && (
                    <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
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
            </DashboardStepCard>

            {/* Step 4: Share Store */}
            <DashboardStepCard
                stepNumber={4}
                title={t("step-4.share-your-store")}
                description={t("step-4.share-your-store-with")}
                icon={Share2}
                status={step4Status}
                footer={
                    hasOperationalSettings ? (
                        <ShareStoreLink stores={dashboardData.stores} />
                    ) : undefined
                }
            >
                {!hasOperationalSettings && (
                    <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                        {t("step-4.first-complete")}
                    </div>
                )}
            </DashboardStepCard>
        </div>
    )
}

export default DashboardSteps 