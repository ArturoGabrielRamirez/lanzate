import { ArrowRight, Crown } from "lucide-react"
import Link from "next/link"
import { getTranslations } from "next-intl/server"

import { TopProductsWidgetProps } from "@/features/overview/types/types"
import { formatCurrency } from "@/features/overview/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/features/shadcn/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"

async function TopProductsWidget({ data }: TopProductsWidgetProps) {

    const t = await getTranslations("overview.top-products")



    return (
        <Card className="grow hover:bg-accent transition-colors duration-200 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-sm md:text-base font-medium">
                        {t("title")}
                    </CardTitle>
                </div>
                <Link href="analytics/top-products" className="text-xs md:text-sm flex items-center gap-1 text-blue-500/50 group-hover:text-blue-500 transition-colors duration-200">
                    ver mas
                    <ArrowRight className="size-4" />
                </Link>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {data.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            {t("no-data")}
                        </p>
                    ) : (
                        data.map((product) => (
                            <div key={product.productId} className="flex items-center space-x-3">

                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={product.image} alt={product.productName} />
                                    <AvatarFallback>
                                        {product.productName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        {product.productName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {product.totalSold} {t("sold")}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm font-medium">
                                        {formatCurrency(product.revenue)}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export { TopProductsWidget }