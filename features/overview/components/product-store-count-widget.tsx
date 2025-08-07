import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Store, Eye, Activity, ArrowRight } from "lucide-react"
import { ProductStoreCountData } from "../types"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

type Props = {
    data: ProductStoreCountData
}

async function ProductStoreCountWidget({ data }: Props) {

    const t = await getTranslations("overview.product-store-count")

    return (
        <Card className="hover:bg-accent transition-colors duration-200 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
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
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col items-center">
                            <Package className="size-4 md:size-5 lg:size-7 text-blue-500" />
                            <div className="flex flex-col items-center">
                                <div className="text-2xl font-bold">{data.totalProducts}</div>
                                <p className="text-xs text-muted-foreground">{t("total-products")}</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <Store className="size-4 md:size-5 lg:size-7 text-green-500" />
                            <div className="flex flex-col items-center">
                                <div className="text-2xl font-bold">{data.totalStores}</div>
                                <p className="text-xs text-muted-foreground">{t("branches")}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                        <div className="flex flex-col items-center">
                            <Activity className="size-4 md:size-5 lg:size-7 text-emerald-500" />
                            <div className="flex flex-col items-center">
                                <div className="text-sm font-medium">{data.activeProducts}</div>
                                <p className="text-xs text-muted-foreground">{t("active")}</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <Eye className="size-4 md:size-5 lg:size-7 text-purple-500" />
                            <div className="flex flex-col items-center">
                                <div className="text-sm font-medium">{data.publishedProducts}</div>
                                <p className="text-xs text-muted-foreground">{t("published")}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ProductStoreCountWidget 