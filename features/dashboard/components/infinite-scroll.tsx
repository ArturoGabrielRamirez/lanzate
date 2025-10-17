import { Loader } from "lucide-react"
import { motion, useInView } from "motion/react"
import { useEffect, useRef } from "react"

import { InfiniteScrollProps } from "@/features/dashboard/types"

function InfiniteScroll({ isLoading, hasMore, next }: InfiniteScrollProps) {

    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref)

    useEffect(() => {

        if (isInView && !isLoading && hasMore) {
            next()
        }

    }, [isInView, isLoading, next, hasMore])



    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            whileInView={{ opacity: 1, height: "auto" }}
            className="flex items-center justify-center"
            ref={ref}
        >
            {isLoading && hasMore && (
                <>
                    <Loader className="size-4 animate-spin" />
                    <p className="text-sm text-muted-foreground">Loading more content...</p>
                </>
            )}
            {!isLoading && !hasMore && <p className="text-sm text-muted-foreground">No more content</p>}
        </motion.div>
    )
}

export { InfiniteScroll }