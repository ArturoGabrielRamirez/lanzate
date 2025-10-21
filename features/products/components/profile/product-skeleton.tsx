import { Card, CardContent } from '@/features/shadcn/components/ui/card'

function ProductSkeleton() {
    return (
        <Card className="animate-pulse">
            <CardContent className="p-4">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3" />
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
            </CardContent>
        </Card>
    )
}

export { ProductSkeleton }