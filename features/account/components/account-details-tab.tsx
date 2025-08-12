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
                <div className="space-y-6 lg:hidden">
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
                                className="font-medium text-xs h-6 px-2 shrink-0"
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
                                className="font-medium text-xs h-6 px-2 shrink-0"
                            />
                        </div>
                    </div>
                </div>

                <div className="hidden lg:grid lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6">
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

                    <div className="flex flex-col space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">{t["description.email"]}</p>
                        <div className="flex items-center gap-3">
                            <p className="font-semibold truncate" title={user.email}>
                                {maskEmail(user.email)}
                            </p>
                            <ChangeEmailButton
                                buttonText="Cambiar"
                                title={t["description.change-email"] || "Cambiar email"}
                                currentEmail={user.email}
                                className="font-medium text-xs h-6 px-2 shrink-0"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2 lg:col-span-2">
                        <p className="text-sm font-medium text-muted-foreground">{t["description.password"]}</p>
                        <div className="flex items-center gap-3">
                            <p className="font-semibold">*********</p>
                            <ChangePasswordButton
                                buttonText={t["description.change-password"]}
                                title={t["description.change-password"]}
                                className="font-medium text-xs h-6 px-2 shrink-0"
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}