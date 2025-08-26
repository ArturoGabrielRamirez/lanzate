'use client'
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { User, AlertTriangle } from "lucide-react"
import { Title } from "@/features/layout/components"
import { EmailStatusBanner } from "@/features/auth/components/index"
import { AccountPageClientProps, UserDeletionStatus, UserType } from "../types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Componentes internos modularizados
import { LoadingSkeleton } from "./loading-skeleton"
import { DeletionRequestedView } from "./deletion-requested-view"

import { DangerZoneTab } from "./danger-zone-tab"
import AccountHeader from "./account-header"
import AccountDetailsTab from "./account-details-tab"

export default function AccountPageClient({ user: initialUser, translations: t }: AccountPageClientProps) {
    const [user, setUser] = useState<UserType>(initialUser)
    const [deletionStatus, setDeletionStatus] = useState<UserDeletionStatus>({
        isDeletionRequested: false,
        deletionRequestedAt: null,
        deletionScheduledAt: null,
        displayScheduledAt: null,
        deletionReason: null,
        canCancel: false,
        daysRemaining: 0,
        minutesRemaining: 0,
        timeRemaining: null,
    })
    const [isDeletionLoading, setIsDeletionLoading] = useState(true)

    useEffect(() => {
        fetchDeletionStatus()
    }, [])

    const fetchDeletionStatus = async () => {
        try {
            const response = await fetch('/api/user/deletion-status')
            if (response.ok) {
                const status = await response.json()
                setDeletionStatus(status)
            }
        } catch (error) {
            console.error('Error fetching deletion status:', error)
        } finally {
            setIsDeletionLoading(false)
        }
    }

    const handleAvatarUpdate = (newAvatarUrl: string | null) => {
        setUser(prevUser => ({
            ...prevUser,
            avatar: newAvatarUrl
        }))
    }

    const handleProfileUpdate = (profile: {
        username: string | null
        firstName: string | null
        lastName: string | null
        phone: string | null
    }) => {
        setUser(prevUser => ({
            ...prevUser,
            username: profile.username,
            first_name: profile.firstName,
            last_name: profile.lastName,
            phone: profile.phone,
            updated_at: new Date()
        }))
    }

    // Mostrar skeleton solo mientras carga el estado de eliminación
    if (isDeletionLoading) {
        return <LoadingSkeleton />
    }

    // Si hay solicitud de eliminación, mostrar vista especial
    if (deletionStatus.isDeletionRequested) {
        return (
            <DeletionRequestedView
                user={user}
                deletionStatus={deletionStatus}
                onStatusChange={fetchDeletionStatus}
            />
        )
    }

    // Vista normal de la cuenta
    return (
        <div className="p-2 md:p-4 grow flex flex-col pt-13 md:pt-24 relative pb-20 container mx-auto z-10">
            <div className="flex-shrink-0 p-0 md:p-4 mb-2 md:mb-0">
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
                <AccountHeader
                    user={user}
                    translations={t}
                    onAvatarUpdate={handleAvatarUpdate}
                    onProfileUpdate={handleProfileUpdate}
                />
            </div>
            
            <section className="flex-1 px-0 md:px-4 pb-4 overflow-hidden">
                <Tabs defaultValue="account" className="h-full grid grid-cols-1 md:grid-cols-[300px_1fr] grid-rows-[auto_1fr] md:grid-rows-[1fr] w-full md:gap-4">
                    <TabsList className="w-full h-fit items-start flex-shrink-0">
                        <div className="flex md:block w-full">
                            <TabsTrigger value="account" className="w-full h-fit cursor-pointer py-3">
                                {t["description.account-details"]}
                            </TabsTrigger>
                            <TabsTrigger value="danger-zone" className="w-full h-fit cursor-pointer py-3">
                                Zona de Peligro
                            </TabsTrigger>
                        </div>
                    </TabsList>
                    
                    <TabsContent value="account" className="h-full overflow-hidden">
                        <div className="h-full overflow-y-auto">
                            <AccountDetailsTab user={user} translations={t} />
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="danger-zone" className="h-full overflow-hidden">
                        <div className="h-full overflow-y-auto">
                            <DangerZoneTab
                                userId={user.id}
                                onStatusChange={fetchDeletionStatus}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </section>
        </div>
    )
}