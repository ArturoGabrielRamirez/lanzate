import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import * as motion from "motion/react-client"

function DashboardStatCardSkeleton({ index }: { index: number }) {
    const baseDelay = index * 0.1

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: baseDelay }}
        >
            <Card className="!p-2 !gap-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 !px-2">
                    <CardTitle className="text-sm font-medium">
                        <Skeleton className="h-4 w-20" />
                    </CardTitle>
                    <Skeleton className="h-4 w-4 rounded" />
                </CardHeader>
                <CardContent className="!px-2">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-24" /> {/* Main value */}
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-3 w-3 rounded" /> {/* Arrow icon */}
                            <Skeleton className="h-3 w-32" /> {/* Percentage change text */}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

function DashboardStatsSkeleton() {
    return (
        <motion.div
            className="grid-cols-2 xl:grid-cols-4 2xl:grid-cols-2 gap-4 area-[stats] opacity-50 hover:opacity-100 transition-opacity duration-300 hidden lg:grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {[...Array(4)].map((_, index) => (
                <DashboardStatCardSkeleton key={index} index={index} />
            ))}
        </motion.div>
    )
}

export default DashboardStatsSkeleton 