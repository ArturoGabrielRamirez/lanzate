'use client'

import {
    Edit,
    Camera,
    Image,
    Store,
    User,
    Shield,
    CreditCard,
    AlertTriangle,
    Mail,
    Key,
    ArrowUp,
    X,
    Trash2
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { SectionContainer } from "@/features/stores/components"

export function AccountShortcuts() {
    const navigationShortcuts = [
        {
            label: "Info Básica",
            key: "1",
            icon: <User className="size-3.5" />,
            description: "Tab información"
        },
        {
            label: "Seguridad",
            key: "2",
            icon: <Shield className="size-3.5" />,
            description: "Tab seguridad"
        },
        {
            label: "Membresía",
            key: "3",
            icon: <CreditCard className="size-3.5" />,
            description: "Tab membresía"
        },
        {
            label: "Zona Peligro",
            key: "4",
            icon: <AlertTriangle className="size-3.5" />,
            description: "Tab zona peligro"
        },
        {
            label: "Tiendas",
            key: "T",
            icon: <Store className="size-3.5" />,
            description: "Ir a /stores"
        },
    ]

    const actionShortcuts = [
        {
            label: "Editar perfil",
            key: "E",
            icon: <Edit className="size-3.5" />,
            description: "En tab Info",
            category: "account"
        },
        {
            label: "Cambiar avatar",
            key: "A",
            icon: <Camera className="size-3.5" />,
            description: "En tab Info",
            category: "account"
        },
        {
            label: "Cambiar banner",
            key: "B",
            icon: <Image className="size-3.5" />,
            description: "En tab Info",
            category: "account"
        },
        {
            label: "Cambiar email",
            key: "M",
            icon: <Mail className="size-3.5" />,
            description: "En tab Seguridad",
            category: "security"
        },
        {
            label: "Cambiar clave",
            key: "P",
            icon: <Key className="size-3.5" />,
            description: "En tab Seguridad",
            category: "security"
        },
        {
            label: "Upgrade plan",
            key: "U",
            icon: <ArrowUp className="size-3.5" />,
            description: "En tab Membresía",
            category: "membership"
        },
        {
            label: "Cancelar sub",
            key: "X",
            icon: <X className="size-3.5" />,
            description: "En tab Membresía",
            category: "membership"
        },
        {
            label: "Eliminar cuenta",
            key: "D",
            icon: <Trash2 className="size-3.5" />,
            description: "En tab Peligro",
            category: "danger-zone"
        },
    ]

    function ShortcutItem({ shortcut }: { shortcut: { label: string; key: string; icon: React.ReactNode; description: string } }) {
  return <div className="flex items-center justify-between group hover:bg-muted/50 p-2 rounded-md transition-colors">
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
}

    return (
        <SectionContainer title="Atajos de teclado" className="@container">
            <Card>
                <CardContent className="p-4 space-y-4">
                    {/* Navegación */}
                    <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Navegación
                        </h4>
                        <div className="space-y-1">
                            {navigationShortcuts.map((shortcut, index) => (
                                <ShortcutItem key={index} shortcut={shortcut} />
                            ))}
                        </div>
                    </div>

                    {/* Acciones */}
                    <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Acciones por tab
                        </h4>
                        <div className="space-y-1">
                            {actionShortcuts.map((shortcut, index) => (
                                <ShortcutItem key={index} shortcut={shortcut} />
                            ))}
                        </div>
                    </div>

                    {/* Tip */}
                    <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                        Presiona <kbd className="px-1 py-0.5 text-xs bg-muted border border-border rounded">H</kbd> para ver todos los atajos
                    </p>
                </CardContent>
            </Card>
        </SectionContainer>
    )
}
