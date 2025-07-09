"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, StoreIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import { StoreCardProps } from "@/features/stores/types"

function StoreCard({ store }: StoreCardProps) {

    const router = useRouter()

    const handleClick = () => {
        router.push(`/stores/${store.slug}/account`)
    }

    return (
        <Card className="hover:scale-105 transition-all cursor-pointer hover:bg-primary hover:text-primary-foreground" onClick={handleClick}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <StoreIcon className="size-6" />
                    <h2 className="text-2xl font-bold">{store.name}</h2>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{store.description || "No description"}</p>
            </CardContent>
            <CardFooter className="justify-between">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="size-4" />
                    {store.created_at.toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                    0 products
                </p>
            </CardFooter>
        </Card>
    )
}

export default StoreCard
