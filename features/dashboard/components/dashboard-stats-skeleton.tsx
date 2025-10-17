import { ChartNoAxesCombined, Store, Package, ShoppingCart, DollarSign } from "lucide-react"
import * as motion from "motion/react-client"
import { useTranslations } from "next-intl"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardStatCardSkeletonProps } from "@/features/dashboard/types"

function DashboardStatCardSkeleton({ index, stat }: DashboardStatCardSkeletonProps) {
    const baseDelay = index * 0.1

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: baseDelay }}
        >
            <Card className="!p-2 !gap-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 !px-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                    <stat.icon className="h-4 w-4 text-primary/50 group-hover:text-primary transition-all" />
                </CardHeader>
                <CardContent className="!px-2">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-24 text-2xl font-bold translate-y-5 group-hover:translate-y-0 transition-all duration-200 ease-out group-hover:text-xl" />
                        <div className="flex items-center space-x-2 pb-3">
                            <Skeleton className="h-3 w-3 rounded" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

function DashboardStatsSkeleton() {
    const t = useTranslations("dashboard.stats")

    const statsData = [
        {
            title: t("total-revenue"),
            icon: DollarSign
        },
        {
            title: t("orders"),
            icon: ShoppingCart
        },
        {
            title: t("products"),
            icon: Package
        },
        {
            title: t("active-stores"),
            icon: Store
        }
    ]

    return (
        <div className="area-[stats] hidden lg:block group/stats">
            <div className="flex items-center justify-between mb-2 md:mb-4">
                <h2 className="text-lg lg:text-2xl font-bold leading-6 flex items-center gap-2 text-primary/50 group-hover/stats:text-primary transition-all">
                    <ChartNoAxesCombined className="size-4 xl:size-5" />
                    {t("title")}
                </h2>
            </div>
            <motion.div className="grid-cols-2 gap-4 lg:grid lg:gap-6">
                {statsData.map((stat, index) => (
                    <DashboardStatCardSkeleton key={index} index={index} stat={stat} />
                ))}
            </motion.div>
        </div>
    )
}

export { DashboardStatsSkeleton, DashboardStatCardSkeleton }