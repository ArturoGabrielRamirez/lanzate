"use client"
import { Skeleton } from "@/components/ui/skeleton";

export function DangerZoneSkeleton() {
    return (
        <div className="border border-red-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2">
                <Skeleton className="size-5" />
                <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-4 w-full" />
            <div className="space-y-3 pt-4">
                <Skeleton className="h-10 w-40" />
            </div>
        </div>
    )
}
