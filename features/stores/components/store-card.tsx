import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, StoreIcon } from "lucide-react"
import { StoreCardProps } from "@/features/stores/types"
import Link from "next/link"
import { getTranslations } from "next-intl/server"

async function StoreCard({ store }: StoreCardProps) {

    const t = await getTranslations("store.store-card")


    return (
        <Link href={`/stores/${store.slug}/account`}>
            <Card className="cursor-pointer transition-all gap-2 md:gap-3 lg:gap-4 shrink-0 group  h-full group not-dark:bg-gradient-to-br not-dark:to-background not-dark:from-transparent not-dark:to-120% border-white/5 backdrop-blur-sm hover:!shadow-2xl dark:via-background hover:border-white/40 relative dark:hover:to-primary/20 dark:bg-card">
                <CardHeader className="gap-0">
                    <CardTitle className="flex items-center gap-2">
                        <StoreIcon className="size-4 md:size-5 lg:size-6 text-primary/50 group-hover:text-primary transition-all" />
                        <h2 className="text-lg md:text-xl lg:text-2xl font-bold">{store.name}</h2>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{store.description || t("no-description")}</p>
                </CardContent>
                <CardFooter className="justify-between items-center gap-2">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="size-4" />
                        {store.created_at.toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        0 {t("products")}
                    </p>
                </CardFooter>
            </Card>
        </Link>
    )
}

export default StoreCard
