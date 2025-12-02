'use client'

import { Edit, Camera, Store, Settings, CreditCard, AlertTriangle } from "lucide-react"

import { Card, CardContent } from "@/features/shadcn/components/ui/card"
import { SectionContainer } from "@/features/stores/components"

export function AccountShortcuts() {
    const shortcuts = [
        {
            label: "Editar perfil",
            key: "E",
            icon: <Edit className="size-3.5" />,
            description: "Abrir editor de perfil"
        },
        {
            label: "Cambiar avatar",
            key: "A",
            icon: <Camera className="size-3.5" />,
            description: "Actualizar foto de perfil"
        },
        {
            label: "Ver tiendas",
            key: "T",
            icon: <Store className="size-3.5" />,
            description: "Ir a mis tiendas"
        },
        {
            label: "Detalles cuenta",
            key: "1",
            icon: <Settings className="size-3.5" />,
            description: "Tab de detalles"
        },
        {
            label: "Membresía",
            key: "2",
            icon: <CreditCard className="size-3.5" />,
            description: "Tab de membresía"
        },
        {
            label: "Zona peligro",
            key: "3",
            icon: <AlertTriangle className="size-3.5" />,
            description: "Tab zona peligro"
        },
    ]

    return (
        <SectionContainer title="Tus atajos" className="@container">
            <Card>
                <CardContent className="p-4">
                    <div className="space-y-2">
                        {shortcuts.map((shortcut, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between group hover:bg-muted/50 p-2 rounded-md transition-colors"
                            >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <div className="text-muted-foreground">
                                        {shortcut.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {shortcut.label}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {shortcut.description}
                                        </p>
                                    </div>
                                </div>
                                <kbd className="px-2 py-1 text-xs bg-muted border border-border rounded shrink-0 font-mono">
                                    {shortcut.key}
                                </kbd>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </SectionContainer>
    )
}