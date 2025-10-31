import { ArrowRight, Store } from "lucide-react"
import * as motion from "motion/react-client"

import { StoreCardSkeleton } from "@/features/dashboard/components/store-list"
import { Skeleton } from "@/features/shadcn/components/ui/skeleton"

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

export { StoreListSkeleton } 