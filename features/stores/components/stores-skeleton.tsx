import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, StoreIcon, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import * as motion from "motion/react-client"
import CreateStoreButton from "./create-store-button"

function StoreCardSkeleton({ index }: { index: number }) {
    const baseDelay = index * 0.1

    return (
        <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3, delay: baseDelay }}
            className="shrink-0"
        >
            <Card className="gap-2 md:gap-3 lg:gap-4">
                <CardHeader className="gap-0">
                    <CardTitle className="flex items-center gap-2">
                        <StoreIcon className="size-4 md:size-5 lg:size-6" />
                        <Skeleton className="h-6 md:h-7 lg:h-8 w-32 md:w-40" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                    </div>
                </CardContent>
                <CardContent className="justify-between items-center gap-2 flex">
                    <div className="flex items-center gap-2">
                        <Calendar className="size-4" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                </CardContent>
            </Card>
        </motion.div>
    )
}

function StoresSkeleton() {
    return (
        <motion.section
            className="grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-4"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
        >
            {/* Create Store Card */}
            <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Card className="border-dashed">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus />
                                <h2 className="text-2xl font-bold">Nueva tienda</h2>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center items-center grow">
                            <Button disabled className="w-full">
                                <Plus className="size-4" />
                                <Skeleton className="h-4 w-24" />
                            </Button>
                        </CardContent>
                    </Card>
            </motion.div>

            {/* Store Cards */}
            {Array.from({ length: 2 }).map((_, index) => (
                <StoreCardSkeleton key={index} index={index + 1} />
            ))}
        </motion.section>
    )
}

export default StoresSkeleton 