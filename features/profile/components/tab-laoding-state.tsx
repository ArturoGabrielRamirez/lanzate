import { Card, CardContent } from "@/features/shadcn/components/ui/card";

function TabLoadingState() {
    return (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 bg-gray-700/50 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-700/50 rounded w-1/2"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export { TabLoadingState }