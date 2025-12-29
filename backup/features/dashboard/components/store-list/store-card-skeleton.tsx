import * as motion from "motion/react-client"

import { StoreCardSkeletonProps } from "@/features/dashboard/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { Skeleton } from "@/features/shadcn/components/ui/skeleton"

function StoreCardSkeleton({ index }: StoreCardSkeletonProps) {
    const baseDelay = index * 0.1

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: baseDelay }}
            className="shrink-0"
        >
            <Card className="gap-2 md:gap-3 lg:gap-4">
                <CardHeader className="gap-0">
                    <CardTitle className="flex items-center gap-2">
                        <Skeleton className="size-4 md:size-5 lg:size-6 rounded" />
                        <Skeleton className="h-6 md:h-7 lg:h-8 w-32 md:w-40" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </CardContent>
                <CardFooter className="justify-between items-center gap-2">
                    <div className="flex items-center gap-2">
                        <Skeleton className="size-4 rounded" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                </CardFooter>
            </Card>
        </motion.div>
    )
}

export { StoreCardSkeleton }