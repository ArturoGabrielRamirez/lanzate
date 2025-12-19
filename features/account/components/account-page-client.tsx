'use client'

import { AlertTriangle, CreditCard, Shield, User } from "lucide-react"
import { Suspense, useState } from "react"

import { DeletionRequestedView } from "@/features/account/components"
import { AccountBannerHeader } from "@/features/account/components"
import { AccountDetailsTab } from "@/features/account/components/account-details-tab"
import { AccountNavigation } from "@/features/account/components/account-navigation"
import { AccountStats } from "@/features/account/components/account-stats"
import { DangerZoneTab } from "@/features/account/components/danger-zone-tab"
import { LoadingSkeleton } from "@/features/account/components/loading-skeleton"
import { MembershipTab } from "@/features/account/components/membership-tab"
import { SecurityTab } from "@/features/account/components/security-tab"
import { AccountDetailsSkeleton } from "@/features/account/components/skeletons/account-details-skeleton"
import { DangerZoneSkeleton } from "@/features/account/components/skeletons/danger-zone-skeleton"
import { MembershipSkeleton } from "@/features/account/components/skeletons/membership-skeleton"
import { SecuritySkeleton } from "@/features/account/components/skeletons/security-skeleton"
import useDeletionStatus from "@/features/account/hooks/use-deletion-status"
import useUserData from "@/features/account/hooks/use-user-data"
import { AccountPageClientProps } from "@/features/account/types"
import { EmailStatusBanner } from "@/features/auth/components/index"
import { HelpCard } from "@/features/dashboard/components"
import { ShortcutHint, KeyboardShortcutsHelp, ShortcutsToggle } from "@/features/global/components"
import { useKeyboardShortcuts } from "@/features/global/hooks"
import { useKeyboardShortcutsStore } from "@/features/global/stores/keyboard-shortcuts-store"
import { PageContainer } from "@/features/layout/components"
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/features/shadcn/components/ui/tabs"
import { SectionContainer } from "@/features/stores/components"

export function AccountPageClient({ user: initialUser, translations: t }: AccountPageClientProps) {
    const { user, immediateData, handleAvatarUpdate, handleProfileUpdate } = useUserData(initialUser)
    const { deletionStatus, isDeletionLoading, fetchDeletionStatus, hasInitialized } = useDeletionStatus()
    const [activeTab, setActiveTab] = useState<'account' | 'security' | 'membership' | 'danger-zone'>("account")
    const { hintMode } = useKeyboardShortcutsStore()

    // Función para cambiar tab programáticamente
    const navigateToTab = (tab: typeof activeTab) => {
        setActiveTab(tab)
    }

    // Función helper para clickear con retry
    const clickWithRetry = (selector: string, maxAttempts = 10, delay = 100) => {
        let attempts = 0

        const tryClick = () => {
            const element = document.querySelector(selector) as HTMLButtonElement

            if (element) {
                element.click()
                return true
            }

            attempts++

            if (attempts < maxAttempts) {
                setTimeout(tryClick, delay)
            } else {
                console.error(`❌ No se encontró el elemento después de ${maxAttempts} intentos: ${selector}`)
            }
            return false
        }

        tryClick()
    }

    // Función mejorada para danger zone usando ref
    const openDangerZoneDialog = () => {
        // Método 1: Usar el ref global si está disponible
        if (typeof window !== 'undefined' && window.dangerZoneRef?.current) {
            window.dangerZoneRef.current.openDeleteDialog()
            return
        }

        // Método 2: Fallback al click tradicional con más intentos
        clickWithRetry('[data-action="delete-account"]', 20, 100)
    }

    // Configurar atajos de teclado para account
    useKeyboardShortcuts({
        isInAccount: true,
        activeAccountTab: activeTab,

        // Navegación entre tabs (1-4)
        onNavigateToAccount: () => navigateToTab('account'),
        onNavigateToSecurity: () => navigateToTab('security'),
        onNavigateToMembership: () => navigateToTab('membership'),
        onNavigateToDangerZone: () => navigateToTab('danger-zone'),

        // Navegación a tiendas (T)
        onNavigateToStores: () => {
            window.location.href = '/stores'
        },

        // Acciones en tab Info Básica (E, A, B)
        onEditProfile: () => {
            clickWithRetry('[data-action="edit-profile"]', 10, 100)
        },

        onChangeAvatar: () => {
            clickWithRetry('[data-action="change-avatar"]')
        },

        onChangeBanner: () => {
            clickWithRetry('[data-action="change-banner"]')
        },

        // Acciones en tab Seguridad (M, P)
        onChangeEmail: () => {
            clickWithRetry('[data-action="change-email"]')
        },

        onChangePassword: () => {
            clickWithRetry('[data-action="change-password"]')
        },

        // Acciones en tab Membresía (U, X)
        onUpgradePlan: () => {
            const upgradeButton = document.querySelector('[data-action="upgrade-plan"]') as HTMLButtonElement
            upgradeButton?.scrollIntoView({ behavior: 'smooth' })
            clickWithRetry('[data-action="upgrade-plan"]')
        },

        onCancelSubscription: () => {
            clickWithRetry('[data-action="cancel-subscription"]')
        },

        // Acción en tab Zona Peligro (D)
        onDeleteAccount: () => {
            openDangerZoneDialog()
        }
    })

    // Determinar clases de visibilidad según hintMode
    const getHintClasses = () => {
        switch (hintMode) {
            case 'always':
                return 'opacity-100'
            case 'hover':
                return 'opacity-0 group-hover:opacity-100'
            case 'never':
                return '!hidden'
        }
    }

    // Obtener shortcuts según el tab activo
    const getAccountShortcuts = () => {
        // Navegación común
        const navigation = [
            { keys: ['1'], label: 'Info' },
            { keys: ['2'], label: 'Seguridad' },
            { keys: ['3'], label: 'Membresía' },
            { keys: ['4'], label: 'Peligro' },
            { keys: ['T'], label: 'Tiendas' },
        ]

        // Acciones específicas por tab
        const actions: Record<typeof activeTab, { keys: string[], label: string }[]> = {
            'account': [
                { keys: ['E'], label: 'Editar' },
                { keys: ['A'], label: 'Avatar' },
                { keys: ['B'], label: 'Banner' },
            ],
            'security': [
                { keys: ['M'], label: 'Email' },
                { keys: ['P'], label: 'Contraseña' },
            ],
            'membership': [
                { keys: ['U'], label: 'Upgrade' },
                { keys: ['X'], label: 'Cancelar' },
            ],
            'danger-zone': [
                { keys: ['D'], label: 'Eliminar' },
            ]
        }

        return [
            ...actions[activeTab],
            { keys: ['H'], label: 'Ayuda' },
        ]
    }

    // Función para obtener el título según el tab activo
    const getTabTitle = () => {
        switch (activeTab) {
            case 'account':
                return 'Información básica'
            case 'security':
                return 'Seguridad y acceso'
            case 'membership':
                return 'Plan y membresía'
            case 'danger-zone':
                return 'Zona de peligro'
            default:
                return 'Cuenta'
        }
    }

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
        <PageContainer className="gap-4">
            <EmailStatusBanner />

            <AccountBannerHeader
                user={user}
                translations={t}
                onAvatarUpdate={handleAvatarUpdate}
                onProfileUpdate={handleProfileUpdate}
            />

            <div className="grow">
                {/* Mobile: Todo en una columna */}
                <div className="lg:hidden flex flex-col gap-4">
                    <SectionContainer title={getTabTitle()}>
                        <Tabs
                            value={activeTab}
                            className="w-full"
                            onValueChange={(value) => setActiveTab(value as typeof activeTab)}
                        >
                            <TabsList variant="underline" className="w-full justify-start border-b border-muted-foreground/20 !pt-0 overflow-x-auto">
                                <TabsTab value="account" className="group flex-shrink-0">
                                    <div className="flex items-center gap-2">
                                        <User className="size-4" />
                                        <span className="text-xs sm:text-sm">Info</span>
                                    </div>
                                </TabsTab>
                                <TabsTab value="security" className="group flex-shrink-0">
                                    <div className="flex items-center gap-2">
                                        <Shield className="size-4" />
                                        <span className="text-xs sm:text-sm">Seguridad</span>
                                    </div>
                                </TabsTab>
                                <TabsTab value="membership" className="group flex-shrink-0">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="size-4" />
                                        <span className="text-xs sm:text-sm">Membresía</span>
                                    </div>
                                </TabsTab>
                                <TabsTab value="danger-zone" className="group flex-shrink-0">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="size-4" />
                                        <span className="text-xs sm:text-sm">Peligro</span>
                                    </div>
                                </TabsTab>
                            </TabsList>

                            <TabsPanel value="account">
                                <Suspense fallback={<AccountDetailsSkeleton />}>
                                    <AccountDetailsTab
                                        user={user}
                                        immediateData={immediateData}
                                        translations={t}
                                        onProfileUpdate={handleProfileUpdate}
                                    />
                                </Suspense>
                            </TabsPanel>

                            <TabsPanel value="security">
                                <Suspense fallback={<SecuritySkeleton />}>
                                    <SecurityTab user={user} />
                                </Suspense>
                            </TabsPanel>

                            <TabsPanel value="membership">
                                <Suspense fallback={<MembershipSkeleton />}>
                                    <MembershipTab user={user} />
                                </Suspense>
                            </TabsPanel>

                            <TabsPanel value="danger-zone">
                                <Suspense fallback={<DangerZoneSkeleton />}>
                                    <DangerZoneTab
                                        userId={user.id}
                                        onStatusChange={fetchDeletionStatus}
                                    />
                                </Suspense>
                            </TabsPanel>
                        </Tabs>
                    </SectionContainer>
                </div>

                {/* Desktop: Sidebar + Contenido */}
                <div className="hidden lg:grid lg:grid-cols-[1fr_2fr] lg:gap-8">
                    {/* Sidebar sticky */}
                    <div className="flex flex-col gap-8 sticky top-24 h-fit">
                        <SectionContainer title="Configuración" className="@container">
                            <AccountNavigation />
                        </SectionContainer>

                        <AccountStats user={user} immediateData={immediateData} />

                        <HelpCard />
                    </div>

                    {/* Contenido principal con Tabs */}
                    <SectionContainer title={getTabTitle()}>
                        <Tabs
                            value={activeTab}
                            className="w-full"
                            onValueChange={(value) => setActiveTab(value as typeof activeTab)}
                        >
                            <TabsList variant="underline" className="w-full justify-start border-b border-muted-foreground/20 !pt-0">
                                <TabsTab value="account" className="group">
                                    <div className="flex items-center gap-2">
                                        <User className="size-4" />
                                        <span>Información Básica</span>
                                        <kbd className={`hidden xl:inline-flex ml-2 px-1.5 py-0.5 text-xs font-semibold bg-muted/50 text-muted-foreground border border-border/50 rounded transition-opacity duration-200 ${getHintClasses()}`}>
                                            1
                                        </kbd>
                                    </div>
                                </TabsTab>
                                <TabsTab value="security" className="group">
                                    <div className="flex items-center gap-2">
                                        <Shield className="size-4" />
                                        <span>Seguridad</span>
                                        <kbd className={`hidden xl:inline-flex ml-2 px-1.5 py-0.5 text-xs font-semibold bg-muted/50 text-muted-foreground border border-border/50 rounded transition-opacity duration-200 ${getHintClasses()}`}>
                                            2
                                        </kbd>
                                    </div>
                                </TabsTab>
                                <TabsTab value="membership" className="group">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="size-4" />
                                        <span>Membresía</span>
                                        <kbd className={`hidden xl:inline-flex ml-2 px-1.5 py-0.5 text-xs font-semibold bg-muted/50 text-muted-foreground border border-border/50 rounded transition-opacity duration-200 ${getHintClasses()}`}>
                                            3
                                        </kbd>
                                    </div>
                                </TabsTab>
                                <TabsTab value="danger-zone" className="group">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="size-4" />
                                        <span>Zona de Peligro</span>
                                        <kbd className={`hidden xl:inline-flex ml-2 px-1.5 py-0.5 text-xs font-semibold bg-muted/50 text-muted-foreground border border-border/50 rounded transition-opacity duration-200 ${getHintClasses()}`}>
                                            4
                                        </kbd>
                                    </div>
                                </TabsTab>
                            </TabsList>

                            <TabsPanel value="account">
                                <Suspense fallback={<AccountDetailsSkeleton />}>
                                    <AccountDetailsTab
                                        user={user}
                                        immediateData={immediateData}
                                        translations={t}
                                        onProfileUpdate={handleProfileUpdate}
                                    />
                                </Suspense>
                            </TabsPanel>

                            <TabsPanel value="security">
                                <Suspense fallback={<SecuritySkeleton />}>
                                    <SecurityTab user={user} />
                                </Suspense>
                            </TabsPanel>

                            <TabsPanel value="membership">
                                <Suspense fallback={<MembershipSkeleton />}>
                                    <MembershipTab user={user} />
                                </Suspense>
                            </TabsPanel>

                            <TabsPanel value="danger-zone">
                                <Suspense fallback={<DangerZoneSkeleton />}>
                                    <DangerZoneTab
                                        userId={user.id}
                                        onStatusChange={fetchDeletionStatus}
                                    />
                                </Suspense>
                            </TabsPanel>
                        </Tabs>
                    </SectionContainer>
                </div>
            </div>

            {/* Barra de atajos flotante - Solo desktop */}
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 hidden lg:block">
                <div className="bg-background/95 backdrop-blur-sm border border-border rounded-full px-4 py-2 shadow-lg">
                    <div className="flex items-center gap-3">
                        {/* Toggle de hints */}
                        <ShortcutsToggle />

                        <div className="w-px h-6 bg-border" />

                        <span className="text-xs text-muted-foreground mr-2">Atajos:</span>
                        {getAccountShortcuts().map((shortcut, index) => (
                            <ShortcutHint
                                key={index}
                                keys={shortcut.keys}
                                label={shortcut.label}
                                variant="outline"
                                size="sm"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Botón de ayuda flotante - Solo desktop */}
            <div className="fixed bottom-4 right-4 z-50 hidden lg:block">
                <KeyboardShortcutsHelp
                    isInAccount={true}
                    activeAccountTab={activeTab}
                />
            </div>
        </PageContainer>
    )
}