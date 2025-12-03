import { Card, CardContent, CardFooter, CardHeader } from "@/features/shadcn/components/ui/card"
import { Skeleton } from "@/features/shadcn/components/ui/skeleton"

export function DangerZoneSkeleton() {
    return (
        <Card className="border-red-200 dark:border-red-900">
            <CardHeader>
                <Skeleton className="h-6 w-12" />
                {/*     <Skeleton className="h-4 w-96 mt-2" /> */}
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />

                </div>
            </CardContent>
            <CardFooter>
                <Skeleton className="h-6 w-12" />
            </CardFooter>
        </Card>
    )
}