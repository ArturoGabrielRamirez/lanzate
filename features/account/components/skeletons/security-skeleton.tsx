import { Card, CardContent, CardHeader } from "@/features/shadcn/components/ui/card"
import { Skeleton } from "@/features/shadcn/components/ui/skeleton"

export function SecuritySkeleton() {
    return (
        <Card>
            <CardHeader className="pb-3">
                <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                            <Skeleton className="h-9 w-24" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}