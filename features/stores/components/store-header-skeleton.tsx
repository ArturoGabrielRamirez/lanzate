import { Skeleton } from "@/components/ui/skeleton"

function StoreHeaderSkeleton() {
    return (
        <div className="flex flex-col gap-4 pt-2">
            <div className="flex items-center gap-2">
                <Skeleton className="w-6 h-8" />
                <Skeleton className="w-32 h-8" />
            </div>
            <div className="flex items-center gap-2">
                <Skeleton className="w-16 h-4" />
                <Skeleton className="w-2 h-4" />
                <Skeleton className="w-24 h-4" />
            </div>
        </div>
    )
}

export { StoreHeaderSkeleton }