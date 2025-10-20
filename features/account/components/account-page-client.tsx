'use client'

import { User, AlertTriangle, Settings } from "lucide-react"
import { useState, useEffect, useCallback } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/features/shadcn/components/ui/tabs"
import { AccountBannerHeader, AccountDetailsTab, DangerZoneTab, DeletionRequestedView } from "@/features/account/components"
import { LoadingSkeleton } from "@/features/account/components/loading-skeleton"
import useDeletionStatus from "@/features/account/hooks/use-deletion-status"
import useUserData from "@/features/account/hooks/use-user-data"
import { AccountPageClientProps } from "@/features/account/types"
import { EmailStatusBanner } from "@/features/auth/components/index"
import { PageContainer } from "@/features/layout/components"
import { Title } from "@/features/layout/components"

export function AccountPageClient({ user: initialUser, translations: t }: AccountPageClientProps) {
    const { user, immediateData, handleAvatarUpdate, handleProfileUpdate } = useUserData(initialUser)
    const { deletionStatus, isDeletionLoading, fetchDeletionStatus, hasInitialized } = useDeletionStatus()
    const [activeTab, setActiveTab] = useState("account")
    const [dangerZoneLoaded, setDangerZoneLoaded] = useState(false)

    // Handler para actualizar el banner (opcional)
    /*    const handleBannerUpdate = useCallback(async (url: string | null) => {
           // Aquí podrías implementar la lógica para guardar el banner
           // Similar a como manejas el avatar
           if (url) {
   
               toast.success('Banner actualizado')
           }
   
       }, []) */

    const loadDangerZone = useCallback(() => {
        if (!dangerZoneLoaded && activeTab === "danger-zone") {
            setDangerZoneLoaded(true)
        }
    }, [dangerZoneLoaded, activeTab])

    useEffect(() => {
        if (activeTab === "danger-zone") {
            loadDangerZone()
        }
    }, [activeTab, dangerZoneLoaded, loadDangerZone])

    if (isDeletionLoading && deletionStatus.isDeletionRequested && hasInitialized) {
        return <LoadingSkeleton />
    }

    if (deletionStatus.isDeletionRequested && hasInitialized) {
        return (
            <DeletionRequestedView
                user={user}
                deletionStatus={deletionStatus}
                onStatusChange={fetchDeletionStatus}
            />
        )
    }

    return (
        <PageContainer>
            <div className="flex-shrink-0 mb-2 md:mb-4">
                <Title
                    title={(
                        <div className="flex items-center gap-2">
                            <User />
                            {t.title}
                        </div>
                    )}
                    breadcrumbs={[
                        {
                            label: t.title,
                            href: "/account"
                        }
                    ]}
                    showDate
                />
                <EmailStatusBanner />

                <AccountBannerHeader
                    user={user}
                    translations={t}
                    onAvatarUpdate={handleAvatarUpdate}
                    onProfileUpdate={handleProfileUpdate}
                /*  onBannerUpdate={handleBannerUpdate} */
                />
            </div>

            <div className="flex-1 overflow-hidden">
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    defaultValue="account"
                    className="h-full grid grid-cols-1 md:grid-cols-[300px_1fr] grid-rows-[auto_1fr] md:grid-rows-[1fr] w-full md:gap-4"
                >
                    <TabsList className="w-full h-fit items-start flex-shrink-0">
                        <div className="flex md:block w-full">
                            <TabsTrigger value="account" className="w-full h-fit cursor-pointer py-3">
                                <Settings className="size-4" />
                                {t["description.account-details"]}
                            </TabsTrigger>
                            <TabsTrigger
                                value="danger-zone"
                                className="w-full h-fit cursor-pointer py-3"
                                onClick={() => loadDangerZone()}
                            >
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="size-4" />
                                    Zona de Peligro
                                </div>
                            </TabsTrigger>
                        </div>
                    </TabsList>

                    <TabsContent value="account" className="h-full overflow-hidden">
                        <div className="h-full overflow-y-auto">
                            <AccountDetailsTab
                                user={user}
                                immediateData={immediateData}
                                translations={t}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="danger-zone" className="h-full overflow-hidden">
                        <div className="h-full overflow-y-auto">
                            <DangerZoneTab
                                userId={user.id}
                                onStatusChange={fetchDeletionStatus}
                                preload
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </PageContainer>
    )
}