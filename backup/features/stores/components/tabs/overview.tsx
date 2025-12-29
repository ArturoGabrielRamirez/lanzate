import { Store, Sparkles, TrendingUp, Users, Package } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { getUserInfo } from "@/features/global/actions"
import { QuickActionsBar } from "@/features/overview/components/quick-actions-bar"
import { OverviewTabProps } from "@/features/overview/types/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { getStoresFromSlugAction } from "@/features/stores/actions"

async function Overview({ slug }: OverviewTabProps) {
    const t = await getTranslations("overview")

    const { payload: user, hasError: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        console.error(userMessage)
        return null
    }

    const { payload: store, hasError: storeError } = await getStoresFromSlugAction(slug)

    if (storeError || !store) {
        return (
            <div className="text-center p-8">
                <p className="text-muted-foreground">
                    {t("error-loading-store")}
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Welcome Message */}
                <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Store className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold">
                                    ¡Bienvenido a {store.name}!
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Tu centro de control empresarial
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                            En este lugar vas a poder gestionar todos los aspectos de tu negocio de manera eficiente y organizada.
                            Desde el control de inventario hasta el análisis de ventas, todo está a tu alcance.
                        </p>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="font-semibold text-sm">Ventas</p>
                                    <p className="text-xs text-muted-foreground">Monitoreá tu rendimiento</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                                <Package className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="font-semibold text-sm">Productos</p>
                                    <p className="text-xs text-muted-foreground">Gestioná tu catálogo</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                                <Users className="h-5 w-5 text-purple-600" />
                                <div>
                                    <p className="font-semibold text-sm">Equipo</p>
                                    <p className="text-xs text-muted-foreground">Coordiná tu personal</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                                <Sparkles className="h-5 w-5 text-orange-600" />
                                <div>
                                    <p className="font-semibold text-sm">Estadísticas</p>
                                    <p className="text-xs text-muted-foreground">Tomá decisiones inteligentes</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions Bar */}
                <QuickActionsBar slug={slug} storeId={store.id} userId={user.id} />
            </div>
        </div>
    )
}

export { Overview }