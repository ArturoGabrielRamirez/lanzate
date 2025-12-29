import { Store, ShoppingBag, Calendar, Shield } from "lucide-react"

import { AccountStatsProps } from "@/features/account/types"
import { formatJoinDate } from "@/features/account/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { SectionContainer } from "@/features/stores/components"

export function AccountStats({ user, immediateData }: AccountStatsProps) {
    const stats = [
        {
            label: "Tiendas activas",
            value: immediateData?.storesCount || user.Store?.length || 0,
            icon: Store,
            color: "text-blue-600 dark:text-blue-400"
        },
        {
            label: "Tipo de plan",
            value: immediateData?.accountType || user.Account?.[0]?.type || 'FREE',
            icon: ShoppingBag,
            color: "text-green-600 dark:text-green-400"
        },
        {
            label: "Miembro desde",
            value: formatJoinDate(user.created_at),
            icon: Calendar,
            color: "text-purple-600 dark:text-purple-400"
        },
        {
            label: "Estado",
            value: "Verificado",
            icon: Shield,
            color: "text-green-600 dark:text-green-400"
        }
    ]

    return (
        <SectionContainer title="Tu resumen">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Estadísticas
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Icon className={`size-4 ${stat.color}`} />
                                    <span className="text-sm text-muted-foreground">
                                        {stat.label}
                                    </span>
                                </div>
                                <span className="text-sm font-semibold">
                                    {stat.value}
                                </span>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>
        </SectionContainer>
    )
}