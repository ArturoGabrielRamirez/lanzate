'use client'

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { User, AlertTriangle } from "lucide-react"
import DangerZone from "./delete-user/danger-zone"
import { Title } from "@/features/layout/components"
import { AccountHeader, AccountDetailsTab } from "./index"
import { DotPattern } from "@/components/magicui/dot-pattern"
import { EmailStatusBanner } from "@/features/auth/components/index"
import { AccountPageClientProps, UserDeletionStatus, UserType } from "../types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


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
    const [isLoading, setIsLoading] = useState(true)

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
            setIsLoading(false)
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

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Cargando estado de la cuenta...</p>
                </div>
            </div>
        )
    }

    if (deletionStatus.isDeletionRequested) {
        return (
            <div className="h-screen flex flex-col overflow-hidden relative">
                <div className="flex-shrink-0 p-4 pt-17">
                    <Title
                        title={(
                            <div className="flex items-center gap-2 text-red-600">
                                <AlertTriangle />
                                Cuenta en proceso de eliminación
                            </div>
                        )}
                        breadcrumbs={[
                            {
                                label: "Cuenta",
                                href: "/account"
                            }
                        ]}
                        showDate
                    />

                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-red-800">
                                    Tu cuenta está programada para ser eliminada
                                </h3>
                                <p className="text-red-700 mt-1 text-sm">
                                    Solo tienes acceso a la zona de peligro para gestionar la eliminación de tu cuenta.
                                    {deletionStatus.canCancel && " Aún puedes cancelar la eliminación."}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Solo mostrar DangerZone */}
                <section className="flex-1 px-4 pb-4 overflow-hidden">
                    <div className="h-full overflow-y-auto">
                        <DangerZone
                            userId={user.id}
                            onStatusChange={fetchDeletionStatus}
                        />
                    </div>
                </section>

                {/* Pattern de fondo */}
                <DotPattern
                    width={30}
                    height={30}
                    className={cn(
                        "[mask-image:linear-gradient(to_bottom_right,white,transparent_70%,transparent)] ",
                    )}
                />
            </div>
        )
    }

    return (
        <div className="p-4 grow flex flex-col pt-13 md:pt-24 relative pb-20 container mx-auto z-10">

            <div className="flex-shrink-0 p-4 pt-17">
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

            <section className="flex-1 px-4 pb-4 overflow-hidden">
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
                            <DangerZone
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