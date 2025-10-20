import { Card, CardContent, CardHeader } from "@/features/shadcn/components/ui/card"
import { Skeleton } from "@/features/shadcn/components/ui/skeleton"

function OrdersSkeleton() {
    return (
        <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="w-full">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-6 w-20" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <Skeleton className="w-4 h-4" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <div className="flex items-center gap-1">
                                <Skeleton className="w-4 h-4" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                            <div className="flex items-center gap-1">
                                <Skeleton className="w-4 h-4" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Array.from({ length: 2 }).map((_, j) => (
                                <div key={j} className="flex items-center justify-between py-2">
                                    <div className="flex items-center space-x-3">
                                        <Skeleton className="w-12 h-12 rounded-md" />
                                        <div>
                                            <Skeleton className="h-4 w-32 mb-1" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Skeleton className="h-4 w-16 mb-1" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-muted">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-6 w-20" />
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default OrdersSkeleton 