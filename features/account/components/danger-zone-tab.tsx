import { Suspense, lazy } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// Lazy import del componente original
const DangerZoneOriginal = lazy(() => import("./delete-user/danger-zone"))

interface DangerZoneTabProps {
    userId: number
    onStatusChange: () => void
}

export function DangerZoneTab({ userId, onStatusChange }: DangerZoneTabProps) {
    return (
        <Suspense fallback={<DangerZoneSkeleton />}>
            <DangerZoneOriginal
                userId={userId}
                onStatusChange={onStatusChange}
            />
        </Suspense>
    )
}

function DangerZoneSkeleton() {
    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="space-y-3">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-8 w-32" />
            </div>
        </div>
    )
}