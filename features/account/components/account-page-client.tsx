'use client'

import { AlertTriangle, CreditCard, Settings } from "lucide-react"
import { useState, useEffect, useCallback } from "react"

import { AccountBannerHeader, AccountDetailsTab, DangerZoneTab, DeletionRequestedView, MembershipTab } from "@/features/account/components"
import { LoadingSkeleton } from "@/features/account/components/loading-skeleton"
import useDeletionStatus from "@/features/account/hooks/use-deletion-status"
import useUserData from "@/features/account/hooks/use-user-data"
import { AccountPageClientProps } from "@/features/account/types"
import { EmailStatusBanner } from "@/features/auth/components/index"
import { useGlobalKeyboardShortcuts } from "@/features/global/hooks"
import { PageContainer } from "@/features/layout/components"
import { Card, CardContent } from "@/features/shadcn/components/ui/card"
import { SectionContainer } from "@/features/stores/components"


export function AccountPageClient({ user: initialUser, translations: t }: AccountPageClientProps) {
    const { user, immediateData, handleAvatarUpdate, handleProfileUpdate } = useUserData(initialUser)
    const { deletionStatus, isDeletionLoading, fetchDeletionStatus, hasInitialized } = useDeletionStatus()
    const [activeTab, setActiveTab] = useState<"account" | "membership" | "danger-zone">("account")
    const [dangerZoneLoaded, setDangerZoneLoaded] = useState(false)

    // Keyboard shortcuts globales
    useGlobalKeyboardShortcuts()

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

    const tabs = [
        { id: "account", label: t["description.account-details"], icon: Settings },
        { id: "membership", label: "Membresía", icon: CreditCard },
        { id: "danger-zone", label: "Zona de Peligro", icon: AlertTriangle }
    ] as const

    return (
        <PageContainer className="gap-4">
            <EmailStatusBanner />

            <AccountBannerHeader
                user={user}
                translations={t}
                onAvatarUpdate={handleAvatarUpdate}
                onProfileUpdate={handleProfileUpdate}
            />

            {/* Layout similar a Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 lg:gap-8">
                {/* Sidebar con tabs */}
                <div className="lg:sticky lg:top-20 lg:h-fit">
                    <SectionContainer title="Configuración">
                        <Card>
                            <CardContent className="p-0">
                                <nav className="flex lg:flex-col">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => {
                                                    setActiveTab(tab.id)
                                                    if (tab.id === "danger-zone") loadDangerZone()
                                                }}
                                                className={`
                                  flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors
                                  hover:bg-muted/50 first:rounded-t-lg last:rounded-b-lg
                                  lg:first:rounded-l-lg lg:first:rounded-tr-none
                                  lg:last:rounded-r-lg lg:last:rounded-bl-none
                                  ${activeTab === tab.id
                                                        ? 'bg-muted text-foreground border-l-2 border-primary'
                                                        : 'text-muted-foreground'
                                                    }
                                `}
                                            >
                                                <Icon className="size-4 flex-shrink-0" />
                                                <span className="hidden lg:block">{tab.label}</span>
                                            </button>
                                        )
                                    })}
                                </nav>
                            </CardContent>
                        </Card>
                    </SectionContainer>
                </div>

                {/* Contenido principal */}
                <div className="min-h-[400px]">
                    {activeTab === "account" && (
                        <SectionContainer title={t["description.account-details"]}>
                            <AccountDetailsTab
                                user={user}
                                immediateData={immediateData}
                                translations={t}
                            />
                        </SectionContainer>
                    )}

                    {activeTab === "membership" && (
                        <SectionContainer title="Membresía">
                            <MembershipTab user={user} />
                        </SectionContainer>
                    )}

                    {activeTab === "danger-zone" && (
                        <SectionContainer title="Zona de Peligro">
                            <DangerZoneTab
                                userId={user.id}
                                onStatusChange={fetchDeletionStatus}
                                preload
                            />
                        </SectionContainer>
                    )}
                </div>
            </div>
        </PageContainer>
    )
}