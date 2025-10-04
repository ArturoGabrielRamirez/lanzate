import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as motion from "motion/react-client"

function StoreSelectorSkeleton() {
    return (
        <motion.div 
            className="flex flex-col items-center space-y-6"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Title and Description */}
            <motion.div 
                className="text-center"
                initial={{ y: 10 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
            >
                <Skeleton className="h-7 w-48 mx-auto mb-2" />
                <Skeleton className="h-4 w-64 mx-auto" />
            </motion.div>

            {/* Form Controls */}
            <motion.div 
                className="w-full space-y-4"
                initial={{ y: 10 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.2, delay: 0.2 }}
            >
                {/* Store Selector */}
                <Select disabled>
                    <SelectTrigger className="w-full">
                        <SelectValue>
                            <Skeleton className="h-4 w-32" />
                        </SelectValue>
                    </SelectTrigger>
                </Select>

                {/* Branch Selector (conditional) */}
                <motion.div
                    initial={{ y: 5 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                >
                    <Select disabled>
                        <SelectTrigger className="w-full">
                            <SelectValue>
                                <Skeleton className="h-4 w-40" />
                            </SelectValue>
                        </SelectTrigger>
                    </Select>
                </motion.div>

                {/* Confirm Button */}
                <motion.div
                    initial={{ y: 5 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.2, delay: 0.4 }}
                >
                    <Button disabled className="w-full">
                        <Skeleton className="h-4 w-20" />
                    </Button>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}

export default StoreSelectorSkeleton 