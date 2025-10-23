import { DollarSign, ShoppingCart, TrendingUp } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { SalesOverviewWidgetProps } from "@/features/overview/types"
import { formatCurrency } from "@/features/overview/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"

async function SalesOverviewWidget({ data }: SalesOverviewWidgetProps) {

    const t = await getTranslations("overview.sales-overview")

    

    return (
        <Card className="hover:bg-accent transition-colors duration-200 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-sm md:text-base font-medium">
                        {t("title")}
                    </CardTitle>
                </div>
                {/* <Link href="analytics/sales-overview" className="text-xs md:text-sm flex items-center gap-1 text-blue-500/50 group-hover:text-blue-500 transition-colors duration-200">
                    ver mas
                    <ArrowRight className="size-4" />
                </Link> */}
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <div className="text-2xl font-bold">
                            {formatCurrency(data.totalRevenue)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {t("total-revenue")}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <div className="text-sm font-medium">{data.totalOrders}</div>
                                <p className="text-xs text-muted-foreground">{t("orders")}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <div className="text-sm font-medium">
                                    {formatCurrency(data.averageOrderValue)}
                                </div>
                                <p className="text-xs text-muted-foreground">{t("average")}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default SalesOverviewWidget 