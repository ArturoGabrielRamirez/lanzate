"use client"

import { ArrowRight, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { SalesByMonthWidgetProps } from "@/features/overview/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/features/shadcn/components/ui/chart"

function SalesByMonthWidget({ data }: SalesByMonthWidgetProps) {

    const t = useTranslations("overview.sales-by-month")

    const chartConfig = {
        revenue: {
            label: t("revenue"),
            color: "hsl(var(--chart-1))",
        },
        orders: {
            label: t("orders"),
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig

    // Format data for the chart - take only month name for shorter labels
    const chartData = data.map(item => ({
        month: item.month.split(' ')[0], // Only month name, not year
        revenue: item.revenue,
        orders: item.orders
    }))

    return (
        <Card className="hover:bg-accent transition-colors duration-200 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-sm md:text-base font-medium">
                        {t("title")}
                    </CardTitle>
                </div>
                <Link href="analytics/sales-by-month" className="text-xs md:text-sm flex items-center gap-1 text-blue-500/50 group-hover:text-blue-500 transition-colors duration-200">
                    ver mas
                    <ArrowRight className="size-4" />
                </Link>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                        <Bar dataKey="orders" fill="var(--color-orders)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export { SalesByMonthWidget }