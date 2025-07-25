"use client"

import { Store, ShoppingCart, Settings, Share2 } from "lucide-react"
import DashboardStepCard from "./dashboard-step-card"
import ShareStoreLink from "./share-store-link"
import { CreateStoreButton } from "@/features/stores/components"
import { CreateProductForStoreButton, ConfigureStoreOperationsButton } from "@/features/dashboard/components"
import { DashboardStoreStats } from "../types/types"

type DashboardStepsProps = {
    userId: number
    dashboardData: DashboardStoreStats
}

function DashboardSteps({ userId, dashboardData }: DashboardStepsProps) {
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
                    title="Share your store's link!"
                    description="Share your store's link with your customers to start selling!"
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
                title="Create a new store"
                description="To get started selling like a pro, you need to create a new store. This will give you your storefront, a place to list your products, and a place to manage your orders."
                icon={Store}
                status={step1Status}
                footer={
                    !hasStores ? (
                        <CreateStoreButton userId={userId} />
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            You have {dashboardData.storeCount} store{dashboardData.storeCount > 1 ? 's' : ''} created
                        </p>
                    )
                }
            >
                {/* No additional content for step 1 */}
            </DashboardStepCard>

            {/* Step 2: Create Product */}
            <DashboardStepCard
                stepNumber={2}
                title="Create a product"
                description="Once created, your products will be visible to customers and ready for sale. You can add images, descriptions, pricing, and inventory tracking."
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
                        Complete Step 1 first to unlock this feature
                    </div>
                )}
                {hasProducts && (
                    <div className="mt-2 text-xs text-green-600 bg-green-50 p-2 rounded">
                        You have {dashboardData.productCount} product{dashboardData.productCount > 1 ? 's' : ''} created
                    </div>
                )}
            </DashboardStepCard>

            {/* Step 3: Configure Operations */}
            <DashboardStepCard
                stepNumber={3}
                title="Configure operations"
                description="Set up delivery options, business hours, payment methods, and operational settings for your store."
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
                        Complete previous steps to unlock this feature
                    </div>
                )}
                {hasOperationalSettings && (
                    <div className="mt-2 text-xs text-green-600 bg-green-50 p-2 rounded">
                        Operations configured for {dashboardData.operationalSettingsCount} store{dashboardData.operationalSettingsCount > 1 ? 's' : ''}
                    </div>
                )}
            </DashboardStepCard>

            {/* Step 4: Share Store */}
            <DashboardStepCard
                stepNumber={4}
                title="Share your store's link!"
                description="Share your store's link with your customers to start selling!"
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
                        Complete previous steps to unlock this feature
                    </div>
                )}
            </DashboardStepCard>
        </div>
    )
}

export default DashboardSteps 