'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChangeEmailButton, ChangePasswordButton } from "@/features/auth/components/index"
import { AccountDetailsTabProps } from "../types"
import { maskEmail } from "../utils/utils"

export default function AccountDetailsTab({ user, translations: t }: AccountDetailsTabProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{t["description.account-details"]}</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Mobile Layout */}
                <div className="space-y-6 lg:hidden">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">
                                {t["description.username"] || "Nombre de usuario"}
                            </p>
                            <p className="font-semibold">{user.username || "No configurado"}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">{t["description.first-name"]}</p>
                                <p className="font-semibold">{user.first_name || "No configurado"}</p>
                            </div>

                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">{t["description.last-name"]}</p>
                                <p className="font-semibold">{user.last_name || "No configurado"}</p>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">
                                {t["description.phone"] || "Teléfono"}
                            </p>
                            <p className="font-semibold">{user.phone || "No configurado"}</p>
                        </div>
                    </div>

                    <div className="border-t pt-6 space-y-4">
                        <div className="flex flex-col space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">{t["description.email"]}</p>
                            <div className="flex items-center justify-between gap-3">
                                <p className="font-semibold truncate flex-1 min-w-0" title={user.email}>
                                    {maskEmail(user.email)}
                                </p>
                                <ChangeEmailButton
                                    buttonText="Cambiar"
                                    title={t["description.change-email"] || "Cambiar email"}
                                    currentEmail={user.email}
                                    className="font-medium text-xs h-7 px-3 shrink-0"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">{t["description.password"]}</p>
                            <div className="flex items-center justify-between gap-3">
                                <p className="font-semibold">*********</p>
                                <ChangePasswordButton
                                    buttonText={t["description.change-password"]}
                                    title={t["description.change-password"]}
                                    className="font-medium text-xs h-7 px-3 shrink-0"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:block">
                    {/* Personal Information Section */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium mb-4">Información Personal</h3>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {t["description.username"] || "Nombre de usuario"}
                                    </p>
                                    <p className="font-semibold">{user.username || "No configurado"}</p>
                                </div>

                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">{t["description.first-name"]}</p>
                                    <p className="font-semibold">{user.first_name || "No configurado"}</p>
                                </div>

                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">{t["description.last-name"]}</p>
                                    <p className="font-semibold">{user.last_name || "No configurado"}</p>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-3 gap-6">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {t["description.phone"] || "Teléfono"}
                                    </p>
                                    <p className="font-semibold">{user.phone || "No configurado"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Security Section */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-medium mb-4">Seguridad de la Cuenta</h3>
                            <div className="space-y-6">
                                <div className="flex flex-col space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">{t["description.email"]}</p>
                                    <div className="flex items-center justify-between gap-3 p-3 border rounded-lg bg-muted/30">
                                        <p className="font-semibold truncate flex-1" title={user.email}>
                                            {maskEmail(user.email)}
                                        </p>
                                        <ChangeEmailButton
                                            buttonText="Cambiar"
                                            title={t["description.change-email"] || "Cambiar email"}
                                            currentEmail={user.email}
                                            className="font-medium text-xs h-7 px-3 shrink-0"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">{t["description.password"]}</p>
                                    <div className="flex items-center justify-between gap-3 p-3 border rounded-lg bg-muted/30">
                                        <p className="font-semibold">*********</p>
                                        <ChangePasswordButton
                                            buttonText={t["description.change-password"]}
                                            title={t["description.change-password"]}
                                            className="font-medium text-xs h-7 px-3 shrink-0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}