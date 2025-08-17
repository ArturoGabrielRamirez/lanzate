'use client'

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
} from "lucide-react"

import { UserType } from "../types/types"
import { ChangeEmailButton, ChangePasswordButton } from "@/features/auth/components"

interface AccountDetailsTabProps {
    user: UserType
    translations: {
        [key: string]: string
    }
}

export default function AccountDetailsTab({ user, translations: t }: AccountDetailsTabProps) {
    const formatDate = (date: string | Date) => {
        return new Date(date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    return (
        <div className="space-y-4">

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="h-4 w-4" />
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
                            <div className="p-2 bg-muted/50 border rounded text-sm">
                                {user.username || <span className="text-muted-foreground italic">No establecido</span>}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                <User className="h-3 w-3" />
                                Nombre
                            </div>
                            <div className="p-2 bg-muted/50 border rounded text-sm">
                                {user.first_name || <span className="text-muted-foreground italic">No establecido</span>}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                <User className="h-3 w-3" />
                                Apellido
                            </div>
                            <div className="p-2 bg-muted/50 border rounded text-sm">
                                {user.last_name || <span className="text-muted-foreground italic">No establecido</span>}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                Teléfono
                            </div>
                            <div className="p-2 bg-muted/50 border rounded text-sm">
                                {user.phone || <span className="text-muted-foreground italic">No establecido</span>}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                Registro
                            </div>
                            <div className="p-2 bg-muted/50 border rounded text-sm">
                                {formatDate(user.created_at)}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Shield className="h-4 w-4" />
                        Seguridad
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <div className="font-medium text-sm">Cambiar email</div>
                                    <div className="text-xs text-muted-foreground font-mono">
                                        {user.email.split('@')[0].substring(0, 2)}{'*'.repeat(Math.max(0, user.email.split('@')[0].length - 2))}@{user.email.split('@')[1]}
                                    </div>
                                </div>
                            </div>
                            <ChangeEmailButton
                                buttonText="cambiar"
                                title="Cambiar email"
                                className="flex gap-2 items-center"
                                currentEmail={user.email}
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center gap-2">
                                <Key className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <div className="font-medium text-sm">Cambiar contraseña</div>
                                    <div className="text-xs text-muted-foreground">Actualiza tu contraseña</div>
                                </div>
                            </div>
                            <ChangePasswordButton
                                buttonText="cambiar"
                                title="Cambiar contraseña"
                                className="flex gap-2 items-center"

                            />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center gap-2">
                                <Smartphone className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm">2FA</span>
                                        <Badge variant="secondary" className="text-xs">Próximamente</Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground">Verificación en dos pasos</div>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" disabled>
                                Configurar
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center gap-2">
                                <Monitor className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm">Sesiones</span>
                                        <Badge variant="secondary" className="text-xs">Próximamente</Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground">Administrar dispositivos</div>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" disabled>
                                Ver
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="h-4 w-4" />
                        Estadísticas de la cuenta
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold text-primary">
                                {user.Account?.length || 0}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Planes activos
                            </div>
                        </div>

                        <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold text-primary">
                                {user.Store?.length || 0}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Tiendas creadas
                            </div>
                        </div>

                        <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold text-primary">
                                {user.Account?.[0]?.type || 'FREE'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Tipo de plan
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}