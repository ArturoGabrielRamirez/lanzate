import { Shield } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card";
import { Skeleton } from "@/features/shadcn/components/ui/skeleton";

export function SecuritySkeleton() {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="size-4" />
                    Seguridad
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3 flex-1">
                                <Skeleton className="size-4" />
                                <div className="space-y-1 flex-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                            <Skeleton className="h-8 w-16" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}