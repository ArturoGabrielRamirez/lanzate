import { ShoppingCart } from "lucide-react"

import { Button } from "@/features/shadcn/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { Skeleton } from "@/features/shadcn/components/ui/skeleton"

function ProductCardSkeleton() {
    return (
        <Card className="aspect-9/12 bg-accent hover:scale-105 transition-all cursor-pointer object-cover h-full w-full max-h-90 gap-2 animate-pulse" >
            <CardHeader>
                <CardTitle>
                    <Skeleton className="w-full h-4" />
                </CardTitle>
                <CardDescription className="line-clamp-2 h-11">
                    <Skeleton className="w-full h-4" />
                </CardDescription>
            </CardHeader>
            <CardContent className="grow">
                <div className="relative h-full bg-muted rounded-md">
                    <Skeleton className="w-full h-full" />
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <Skeleton className="w-10 h-4" />
                <Button variant="outline" size="icon">
                    <ShoppingCart />
                </Button>
            </CardFooter>
        </Card>
    )
}
export { ProductCardSkeleton }