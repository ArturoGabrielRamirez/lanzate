
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    User,
    Mail,
    Phone,
    Calendar,
    Shield,
    Key,
    Smartphone,
    Monitor,
    Edit,
} from "lucide-react"
import { ChangeEmailButton, ChangePasswordButton } from "@/features/auth/components"
import { useState, useEffect } from "react"
import { maskEmail } from "../utils/utils"
import { Skeleton } from "@/components/ui/skeleton"

// Skeleton inline para evitar dependencias externas
/* function Skeleton({ className }: { className?: string }) {
    return <div className={`animate-pulse bg-muted rounded ${className}`} />
} */

// Interfaces basadas en los tipos reales
interface Account {
    id: number
    created_at: string | Date
    updated_at: string | Date
    user_id: number
    type: string
}

interface Store {   
    id: number
    name: string
    description: string | null
    logo: string | null
    slogan: string | null
    created_at: Date
    updated_at: Date
    user_id: number
    slug: string
    subdomain: string
}

interface UserType {
    id: number
    email: string
    avatar: string | null
    created_at: string | Date
    first_name: string | null
    last_name: string | null
    username: string | null
    phone: string | null
    password: string
    updated_at: string | Date
    supabase_user_id: string | null
    Account: Account[]
    Store: Store[]
}

interface AccountDetailsTabProps {
    user: UserType
    translations: {
        "description.account-details": string
        "description.username": string
        "description.first-name": string
        "description.last-name": string
        "description.email": string
        "description.password": string
        "description.change-email": string
        "description.change-password": string
        "description.phone": string
        [key: string]: string
    }
    immediateData?: {
        username?: string | null
        email: string
        firstName?: string | null
        lastName?: string | null
        phone?: string | null
        avatar?: string | null
        createdAt: Date | string
        activeAccounts: number
        storesCount: number
        accountType: string
    }
}

function BasicInfoCard({ user, immediateData }: { user: UserType; immediateData?: any }) {
    const formatDate = (date: string | Date) => {
        return new Date(date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="size-4" />
                    Información básica
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <User className="h-3 w-3" />
                            Username
                        </div>
                        <div className="p-2 bg-muted/50 border rounded text-sm min-h-[36px] flex items-center">
                            {(immediateData?.username || user.username) || 
                             <span className="text-muted-foreground italic">No establecido</span>}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <User className="h-3 w-3" />
                            Nombre
                        </div>
                        <div className="p-2 bg-muted/50 border rounded text-sm min-h-[36px] flex items-center">
                            {(immediateData?.firstName || user.first_name) || 
                             <span className="text-muted-foreground italic">No establecido</span>}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <User className="h-3 w-3" />
                            Apellido
                        </div>
                        <div className="p-2 bg-muted/50 border rounded text-sm min-h-[36px] flex items-center">
                            {(immediateData?.lastName || user.last_name) || 
                             <span className="text-muted-foreground italic">No establecido</span>}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            Teléfono
                        </div>
                        <div className="p-2 bg-muted/50 border rounded text-sm min-h-[36px] flex items-center">
                            {(immediateData?.phone || user.phone) || 
                             <span className="text-muted-foreground italic">No establecido</span>}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Registro
                        </div>
                        <div className="p-2 bg-muted/50 border rounded text-sm min-h-[36px] flex items-center">
                            {formatDate(immediateData?.createdAt || user.created_at)}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function StatsCard({ user, immediateData }: { user: UserType; immediateData?: any }) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="size-4" />
                    Estadísticas de la cuenta
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-background to-primary/10">
                        <div className="text-2xl font-bold text-primary">
                            {immediateData?.activeAccounts ?? user.Account?.length ?? 0}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Planes activos
                        </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-background to-primary/10">
                        <div className="text-2xl font-bold text-primary">
                            {immediateData?.storesCount ?? user.Store?.length ?? 0}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Tiendas creadas
                        </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-background to-primary/10">
                        <div className="text-2xl font-bold text-primary">
                            {immediateData?.accountType ?? user.Account?.[0]?.type ?? 'FREE'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Tipo de plan
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function SecuritySkeleton() {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="size-4" />
                    Seguridad
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3 flex-1">
                                <Skeleton className="size-4" />
                                <div className="space-y-1 flex-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                            <Skeleton className="h-8 w-16" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

function SecurityCard({ user }: { user: UserType }) {
    const truncateEmail = (email: string, maxLength: number = 20) => {
        if (email.length <= maxLength) return email

        const [localPart, domain] = email.split('@')
        const truncatedLocal = localPart.length > 8
            ? localPart.substring(0, 6) + '...'
            : localPart

        return `${truncatedLocal}@${domain}`
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="size-4" />
                    Seguridad
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {/* Cambiar Email */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 border rounded-lg">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <Mail className="size-4 text-muted-foreground flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                                <div className="font-medium text-sm">Cambiar email</div>
                                <div className="text-xs text-muted-foreground font-mono truncate max-w-[200px]" title={user.email}>
                                    <span className="lg:hidden">{truncateEmail(user.email, 25)}</span>
                                    <span className="hidden lg:inline">{maskEmail(user.email)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-shrink-0 w-full lg:w-auto">
                            <ChangeEmailButton
                                buttonText={<Edit className="size-4" />}
                                title="Cambiar email"
                                currentEmail={user.email}
                            />
                        </div>
                    </div>

                    {/* Cambiar Contraseña */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 border rounded-lg">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <Key className="size-4 text-muted-foreground flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                                <div className="font-medium text-sm">Cambiar contraseña</div>
                                <div className="text-xs text-muted-foreground">Actualiza tu contraseña</div>
                            </div>
                        </div>
                        <div className="flex-shrink-0 w-full lg:w-auto">
                            <ChangePasswordButton
                                buttonText={<Edit className="size-4" />}
                                title="Cambiar contraseña"
                            />
                        </div>
                    </div>

                    {/* 2FA */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 border rounded-lg bg-muted/20">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <Smartphone className="size-4 text-muted-foreground flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-medium text-sm">2FA</span>
                                    <Badge variant="secondary" className="text-xs">Próximamente</Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">Verificación en dos pasos</div>
                            </div>
                        </div>
                        <div className="flex-shrink-0 w-full lg:w-auto">
                            <Button variant="outline" size="sm" disabled className="w-full lg:w-auto px-4 py-2 text-sm">
                                Configurar
                            </Button>
                        </div>
                    </div>

                    {/* Sesiones */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 border rounded-lg bg-muted/20">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <Monitor className="size-4 text-muted-foreground flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-medium text-sm">Sesiones</span>
                                    <Badge variant="secondary" className="text-xs">Próximamente</Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">Administrar dispositivos</div>
                            </div>
                        </div>
                        <div className="flex-shrink-0 w-full lg:w-auto">
                            <Button variant="outline" size="sm" disabled className="w-full lg:w-auto px-4 py-2 text-sm">
                                Ver
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function AccountDetailsTab({ user, translations: t, immediateData }: AccountDetailsTabProps) {
    const [securityVisible, setSecurityVisible] = useState(false)

    // Lazy load de la sección de seguridad después de un delay pequeño
    useEffect(() => {
        const timer = setTimeout(() => {
            setSecurityVisible(true)
        }, 200)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="space-y-4">
            {/* Información básica - carga inmediata con datos disponibles */}
            <BasicInfoCard user={user} immediateData={immediateData} />

            {/* Sección de seguridad - lazy loading progresivo */}
            {securityVisible ? (
                <SecurityCard user={user} />
            ) : (
                <SecuritySkeleton />
            )}

            {/* Estadísticas - carga inmediata con datos disponibles */}
            <StatsCard user={user} immediateData={immediateData} />
        </div>
    )
}