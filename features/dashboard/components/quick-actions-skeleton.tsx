import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Store, Zap } from "lucide-react"
import * as motion from "motion/react-client"

function QuickActionsSkeleton() {
    return (
        <motion.div
            className="area-[actions] opacity-50 hover:opacity-100 transition-opacity duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="md:flex items-center justify-between mb-2 md:mb-4 hidden">
                <h2 className="text-lg lg:text-2xl font-bold leading-6 flex items-center gap-2">
                    <Zap className="size-4 xl:size-5" />
                    Quick Actions
                </h2>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" className="grow" size="icon" disabled>
                    <Skeleton className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="grow" size="icon" disabled>
                    <Store className="size-4" />
                </Button>
                <Button variant="outline" className="grow md:hidden" size="icon" disabled>
                    <Calendar className="size-4" />
                </Button>
            </div>
        </motion.div>
    )
}

export default QuickActionsSkeleton 