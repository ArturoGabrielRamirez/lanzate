"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Store } from "@/prisma/generated/prisma"
import { useRouter } from "next/navigation"

type Props = {
    store: Store
}

function StoreCard({ store }: Props) {

    const router = useRouter()

    const handleClick = () => {
        router.push(`/stores/${store.slug}`)
    }

    return (
        <Card className="hover:scale-105 transition-all cursor-pointer hover:bg-primary hover:text-primary-foreground" onClick={handleClick}>
            <CardHeader>
                <CardTitle>
                    <h2 className="text-2xl font-bold">{store.name}</h2>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{store.description || "No description"}</p>
            </CardContent>
            <CardFooter className="justify-between">
                <p className="text-sm text-muted-foreground">
                    created at: {store.created_at.toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                    0 products
                </p>
            </CardFooter>
        </Card>
    )
}

export default StoreCard
