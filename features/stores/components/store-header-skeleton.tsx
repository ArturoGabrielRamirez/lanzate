import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function StoreHeaderSkeleton() {
    return (
        <>
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
            {/* <section className="flex items-center gap-4">
                <Card className="w-full">
                    <CardContent className="flex flex-col justify-between w-full gap-4 md:items-center xs:flex-row">
                        <div className="flex items-center gap-4">
                            <Skeleton className="rounded-full size-24" />
                            <div className="flex flex-col gap-2">
                                <Skeleton className="w-48 h-6" />
                                <Skeleton className="w-64 h-4" />
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <Skeleton className="w-24 h-4" />
                            <Skeleton className="w-32 h-8" />
                        </div>
                    </CardContent>
                </Card>
            </section> */}
        </>
    )
}

export { StoreHeaderSkeleton }