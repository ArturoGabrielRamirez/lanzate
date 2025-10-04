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
            <div className="flex items-center justify-between mb-2 md:mb-4 text-primary/50 group-hover/stores:text-primary transition-all">
                <h2 className="text-lg lg:text-2xl font-bold leading-6 flex items-center gap-2">
                    <Store className="size-4 xl:size-5" />
                    Tus tiendas
                </h2>
                <p
                    className="flex items-center gap-1 text-sm text-inherit hover:text-primary transition-colors"
                >
                    Ver todas
                    <ArrowRight className="size-4" />
                </p>
            </div>

            <section>
                <div className="sm:hidden mb-3">
                    <Skeleton className="h-10 w-full" />
                </div>

                <motion.div
                    className="md:grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-4 flex overflow-x-auto md:overflow-x-visible"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    {[...Array(1)].map((_, index) => (
                        <StoreCardSkeleton key={index} index={index} />
                    ))}
                </motion.div>
            </section>
        </motion.div>
    )
}

export default StoreListSkeleton 