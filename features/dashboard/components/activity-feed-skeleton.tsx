import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import * as motion from "motion/react-client"

function ActivityFeedItemSkeleton({ index }: { index: number }) {
    const baseDelay = index * 0.1
    
    // Use index to create deterministic variations
    const hasSecondaryContent = index % 3 === 0
    const hasActionButtons = index % 5 === 0

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: baseDelay }}
        >
            <Card className="p-4 space-y-3">
                <CardContent className="p-0 space-y-3">
                    <div className="flex items-start space-x-3">
                        {/* Avatar skeleton */}
                        <Skeleton className="size-10 rounded-full shrink-0" />
                        
                        <div className="flex-1 space-y-2">
                            {/* Main content skeleton */}
                            <div className="flex items-center space-x-2">
                                <Skeleton className="h-4 w-20" /> {/* User name */}
                                <Skeleton className="h-4 w-16" /> {/* Action text */}
                                <Skeleton className="h-4 w-24" /> {/* Item name */}
                                <Skeleton className="h-5 w-16 rounded-full hidden md:block" /> {/* Badge */}
                            </div>

                            {/* Secondary content skeleton (sometimes present) */}
                            {hasSecondaryContent && (
                                <Skeleton className="h-3 w-48" />
                            )}
                            
                            {/* Action buttons skeleton (for contracts) */}
                            {hasActionButtons && (
                                <div className="flex space-x-2">
                                    <Skeleton className="h-8 w-20" />
                                    <Skeleton className="h-8 w-24" />
                                </div>
                            )}

                            {/* Footer with icon and timestamp */}
                            <div className="flex items-center space-x-4 text-xs justify-between">
                                <div className="flex items-center space-x-1">
                                    <Skeleton className="h-3 w-3 rounded-full" /> {/* Icon */}
                                    <Skeleton className="h-3 w-20" /> {/* Store link */}
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Skeleton className="h-3 w-3 rounded-full" /> {/* Clock icon */}
                                    <Skeleton className="h-3 w-16" /> {/* Timestamp */}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

function ActivityFeedSkeleton() {
    return (
        <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {[...Array(8)].map((_, index) => (
                <ActivityFeedItemSkeleton key={index} index={index} />
            ))}
        </motion.div>
    )
}

export default ActivityFeedSkeleton 