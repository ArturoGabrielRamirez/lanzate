import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowRight, Crown } from "lucide-react"
import { TopProductData } from "../types"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

type Props = {
    data: TopProductData[]
}

async function TopProductsWidget({ data }: Props) {

    const t = await getTranslations("overview.top-products")

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(amount)
    }

    return (
        <Card className="grow hover:bg-accent transition-colors duration-200 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-sm md:text-base font-medium">
                        {t("title")}
                    </CardTitle>
                </div>
                <Link href="" className="text-xs md:text-sm flex items-center gap-1 text-blue-500/50 group-hover:text-blue-500 transition-colors duration-200">
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

export default TopProductsWidget 