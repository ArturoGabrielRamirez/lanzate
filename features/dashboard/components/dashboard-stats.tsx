import { ArrowDown, ArrowUp, ChartNoAxesCombined, DollarSign, Package, ShoppingCart, Store } from "lucide-react"
import * as motion from "motion/react-client"
import { getTranslations } from "next-intl/server"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDashboardStats } from "@/features/dashboard/actions/getDashboardStats"
import { DashboardStatsProps, ChangeIndicatorProps } from "@/features/dashboard/types"

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount)
}

function formatNumber(num: number) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
}

function ChangeIndicator({ change }: ChangeIndicatorProps) {
    const isPositive = change >= 0
    const Icon = isPositive ? ArrowUp : ArrowDown
    const colorClass = isPositive ? 'text-green-500' : 'text-red-500'

    return (
        <div className={`flex items-center ${colorClass} transition-all duration-200 ease-out`}>
            <Icon className="h-3 w-3 mr-1" />
            <span className="text-xs">
                {isPositive ? '+' : ''}{change}% from last month
            </span>
        </div>
    )
}

async function DashboardStats({ userId }: DashboardStatsProps) {
    const t = await getTranslations("dashboard.stats")
    const { payload: stats, error } = await getDashboardStats(userId)

    if (error || !stats) {
        return (
            <div className="grid-cols-2 xl:grid-cols-4 2xl:grid-cols-2 gap-4 area-[stats] opacity-50 hover:opacity-100 transition-opacity duration-300 hidden lg:grid">
                <Card className="!p-2 !gap-2">
                    <CardContent className="!px-2 !py-4">
                        <p className="text-xs text-muted-foreground">Failed to load stats</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const statsData = [
        {
            title: t("total-revenue"),
            value: formatCurrency(stats.totalRevenue),
            change: stats.revenueChange,
            icon: DollarSign
        },
        {
            title: t("orders"),
            value: formatNumber(stats.totalOrders),
            change: stats.ordersChange,
            icon: ShoppingCart
        },
        {
            title: t("products"),
            value: formatNumber(stats.totalProducts),
            change: stats.productsChange,
            icon: Package
        },
        {
            title: t("active-stores"),
            value: formatNumber(stats.activeStores),
            change: stats.activeStoresChange,
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
            <motion.div
                className="grid-cols-2 gap-4 lg:grid lg:gap-6"
            >
                {statsData.map((stat) => {
                    const Icon = stat.icon

                    return (
                        <motion.div
                            key={stat.title}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 border-primary group-hover:border-1 rounded-lg blur-sm"></div>
                            <Card className="!p-2 !gap-2 h-full group not-dark:bg-gradient-to-br not-dark:to-background not-dark:from-transparent not-dark:to-120% border-white/5 backdrop-blur-sm hover:!shadow-2xl dark:via-background hover:border-white/40 relative dark:hover:to-primary/20 dark:hover:border-white/40 dark:bg-card">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 !px-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                                    <Icon className="h-4 w-4 text-primary/50 group-hover:text-primary transition-all" />
                                </CardHeader>
                                <CardContent className="!px-2">
                                    <div className="text-2xl font-bold translate-y-5 group-hover:translate-y-0 transition-all duration-200 ease-out group-hover:text-xl truncate">
                                        {stat.value}
                                    </div>
                                    <div className="transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 ease-out group-hover:delay-100">
                                        <ChangeIndicator change={stat.change} />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )
                })}
            </motion.div>
        </div>
    )
}

export default DashboardStats 