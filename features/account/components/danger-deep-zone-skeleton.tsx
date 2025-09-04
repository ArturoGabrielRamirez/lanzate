import { Skeleton } from "@/components/ui/skeleton";

export default function DangerDeepZoneSkeleton() {
    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-10 w-40" />
        </div>
    )
}