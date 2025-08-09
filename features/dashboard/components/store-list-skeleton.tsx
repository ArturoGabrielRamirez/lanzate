import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, Store } from "lucide-react"
import * as motion from "motion/react-client"

function StoreCardSkeleton({ index }: { index: number }) {
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

function StoreListSkeleton() {
    return (
        <motion.div
            className="border-b md:border-b-0 pb-4 md:pb-0 area-[stores] opacity-50 hover:opacity-100 transition-opacity duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center justify-between mb-2 md:mb-4">
                <div className="flex items-center gap-2">
                    <Store className="size-4 xl:size-5" />
                    <Skeleton className="h-6 lg:h-8 w-32 lg:w-48" />
                </div>
                <div className="flex items-center gap-1">
                    <Skeleton className="h-4 w-16" />
                    <ArrowRight className="size-4 text-muted-foreground" />
                </div>
            </div>
            
            <section>
                {/* Mobile create button skeleton */}
                <div className="sm:hidden mb-3">
                    <Skeleton className="h-10 w-full" />
                </div>
                
                {/* Store cards grid */}
                <motion.div
                    className="md:grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-4 flex overflow-x-auto md:overflow-x-visible"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    {[...Array(1)].map((_, index) => (
                        <StoreCardSkeleton key={index} index={index} />
                    ))}
                    
                    {/* Create store card skeleton (desktop) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="shrink-0 hidden sm:block"
                    >
                        <Card className="border-dashed gap-2 md:gap-3 lg:gap-4 bg-transparent">
                            <CardContent className="flex justify-center items-center grow flex-col min-h-[160px]">
                                <Skeleton className="h-4 w-16 mb-2" />
                                <Skeleton className="h-3 w-32" />
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </section>
        </motion.div>
    )
}

export default StoreListSkeleton 