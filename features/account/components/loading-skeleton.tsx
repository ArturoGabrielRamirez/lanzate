import { Skeleton } from "@/features/shadcn/components/ui/skeleton"

export function LoadingSkeleton() {
    return (
        <div className="p-2 md:p-4 grow flex flex-col pt-13 md:pt-24 relative pb-20 container mx-auto z-10">
            {/* Skeleton para el header */}
            <div className="flex-shrink-0 p-0 md:p-4 mb-2 md:mb-0">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Skeleton className="h-6 w-6" />
                        <Skeleton className="h-8 w-32" />
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Skeleton className="h-4 w-16" />
                        <span className="text-muted-foreground text-xs">/</span>
                        <Skeleton className="h-4 w-20" />
                        <div className="ml-auto">
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                </div>

                {/* Skeleton para AccountHeader */}
                <div className="flex items-center gap-4 p-6 bg-card rounded-lg border mb-6">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-5 w-20 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-9 w-28 rounded-md" />
                </div>
            </div>

            {/* Skeleton para las tabs */}
            <section className="flex-1 px-0 md:px-4 pb-4 overflow-hidden">
                <div className="h-full grid grid-cols-1 md:grid-cols-[300px_1fr] grid-rows-[auto_1fr] md:grid-rows-[1fr] w-full md:gap-4">
                    {/* Skeleton para TabsList */}
                    <div className="w-full h-fit bg-card rounded-lg border p-1">
                        <div className="flex md:block w-full gap-1">
                            <Skeleton className="h-10 w-full rounded-md" />
                            <Skeleton className="h-10 w-full rounded-md" />
                        </div>
                    </div>

                    {/* Skeleton para el contenido de las tabs */}
                    <div className="h-full space-y-4">
                        {/* Información básica */}
                        <div className="bg-card rounded-lg border p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Skeleton className="h-5 w-5" />
                                <Skeleton className="h-6 w-40" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-18" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Seguridad */}
                        <div className="bg-card rounded-lg border p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Skeleton className="size-5" />
                                <Skeleton className="h-6 w-24" />
                            </div>
                            <div className="space-y-4">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="size-5" />
                                            <div>
                                                <Skeleton className="h-5 w-28 mb-1" />
                                                <Skeleton className="h-4 w-48" />
                                            </div>
                                        </div>
                                        <Skeleton className="size-6 rounded-md" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Estadísticas */}
                        <div className="bg-card rounded-lg border p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Skeleton className="h-5 w-5" />
                                <Skeleton className="h-6 w-44" />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div key={index} className="text-center p-4 border rounded-lg">
                                        <Skeleton className="h-8 w-8 mx-auto mb-2" />
                                        <Skeleton className="h-6 w-12 mx-auto mb-1" />
                                        <Skeleton className="h-4 w-20 mx-auto" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}