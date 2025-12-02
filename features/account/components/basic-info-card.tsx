"use client"
import { Calendar, Phone, User } from "lucide-react"

import { BasicInfoCardProps } from "@/features/account/types"
import { ProfileEditor } from "@/features/auth/components/profile/profile-editor"
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"

export function BasicInfoCard({
    user,
    immediateData,
    onProfileUpdate
}: BasicInfoCardProps) {
    const formatDate = (date: string | Date) => {
        return new Date(date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    // Preparar los valores que se pasarán a ProfileEditor
    const currentUsername = immediateData?.username || user.username || ""
    const currentFirstName = immediateData?.firstName || user.first_name || ""
    const currentLastName = immediateData?.lastName || user.last_name || ""
    const currentPhone = immediateData?.phone || user.phone || ""

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg whitespace-nowrap w-full">
                        <User className="size-5" />
                        Información básica
                    </CardTitle>
                    <div className="size-4 pr-7">
                        <ProfileEditor
                            currentEmail={user.email}
                            currentUsername={currentUsername}
                            currentFirstName={currentFirstName}
                            currentLastName={currentLastName}
                            currentPhone={currentPhone}
                            onProfileUpdate={onProfileUpdate}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <User className="h-3 w-3" />
                            Nombre de usuario
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