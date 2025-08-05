import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function OrderDetailsSkeleton() {
    return (
        <div className="space-y-6">

            <Card className="w-full">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Skeleton className="w-4 h-4 rounded" />
                            <Skeleton className="w-24 h-4" />
                        </div>
                        <div className="flex items-center gap-1">
                            <Skeleton className="w-4 h-4 rounded" />
                            <Skeleton className="w-20 h-4" />
                        </div>
                        <div className="flex items-center gap-1">
                            <Skeleton className="w-4 h-4 rounded" />
                            <Skeleton className="w-16 h-4" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <Skeleton className="h-6 w-24" />
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                                    <Skeleton className="w-16 h-16 rounded" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                    <div className="text-right space-y-1">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-12" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 border-t border-muted">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-6 w-20" />
                            </div>
                            <div className="flex justify-between items-center text-sm text-muted-foreground mt-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default OrderDetailsSkeleton 