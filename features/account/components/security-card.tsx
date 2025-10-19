import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Key, Mail, Monitor, Shield, Smartphone } from "lucide-react"
import { maskEmail } from "../utils/utils"
import { ChangeEmailButton, ChangePasswordButton } from "@/features/auth/components"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserType } from "../types"

export function SecurityCard({ user }: { user: UserType }) {
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
