"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, StoreIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { StoreCardProps } from "@/features/stores/types"
import { useTranslations } from "next-intl"

function StoreCard({ store }: StoreCardProps) {

    const router = useRouter()
    const t = useTranslations("store.store-card")

    const handleClick = () => {
        router.push(`/stores/${store.slug}/account`)
    }

    return (
        <Card className="transition-all cursor-pointer bg-background gap-2 md:gap-3 lg:gap-4 shrink-0 relative border-primary/5 hover:border-primary/20 group" onClick={handleClick}>
            <div className="absolute inset-0 bg-primary/10 blur-md -z-10 group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
            <CardHeader className="gap-0">
                <CardTitle className="flex items-center gap-2 ">
                    <StoreIcon className="size-4 md:size-5 lg:size-6" />
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
    )
}

export default StoreCard
