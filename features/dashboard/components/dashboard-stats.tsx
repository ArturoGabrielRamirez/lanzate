import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, DollarSign, Package, ShoppingCart, Store } from "lucide-react"
import { getDashboardStats } from "../actions/getDashboardStats"
import * as motion from "motion/react-client"

type Props = {
    userId: number
}

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

function ChangeIndicator({ change }: { change: number }) {
    const isPositive = change >= 0
    const Icon = isPositive ? ArrowUp : ArrowDown
    const colorClass = isPositive ? 'text-green-500' : 'text-red-500'
    
    return (
        <div className={`flex items-center ${colorClass}`}>
            <Icon className="h-3 w-3 mr-1" />
            <span className="text-xs">
                {isPositive ? '+' : ''}{change}% from last month
            </span>
        </div>
    )
}

async function DashboardStats({ userId }: Props) {
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
            title: "Total Revenue",
            value: formatCurrency(stats.totalRevenue),
            change: stats.revenueChange,
            icon: DollarSign
        },
        {
            title: "Orders",
            value: formatNumber(stats.totalOrders),
            change: stats.ordersChange,
            icon: ShoppingCart
        },
        {
            title: "Products",
            value: formatNumber(stats.totalProducts),
            change: stats.productsChange,
            icon: Package
        },
        {
            title: "Active Stores",
            value: formatNumber(stats.activeStores),
            change: stats.activeStoresChange,
            icon: Store
        }
    ]

    return (
        <motion.div
            className="grid-cols-2 xl:grid-cols-4 2xl:grid-cols-2 gap-4 area-[stats] opacity-50 hover:opacity-100 transition-opacity duration-300 hidden lg:grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {statsData.map((stat, index) => {
                const Icon = stat.icon
                const baseDelay = index * 0.1

                return (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: baseDelay }}
                    >
                        <Card className="!p-2 !gap-2">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 !px-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="!px-2">
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <ChangeIndicator change={stat.change} />
                            </CardContent>
                        </Card>
                    </motion.div>
                )
            })}
        </motion.div>
    )
}

export default DashboardStats 