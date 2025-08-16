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
        <Card className="hover:scale-105 cursor-pointer transition-discrete transition-all duration-200 from-transparent to-background/90 bg-radial-[circle_at_center_center] hover:[background-size:200%_100%] [background-size:100%_300%] [background-position:bottom_left] hover:[background-position:top_right] border-white/5 hover:text-primary-foreground gap-2 md:gap-3 lg:gap-4 shrink-0" onClick={handleClick}>
            <CardHeader className="gap-0">
                <CardTitle className="flex items-center gap-2">
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
