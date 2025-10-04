import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Store, TrendingUp, Package, Users, Sparkles } from "lucide-react"
import * as motion from "motion/react-client"

function OverviewSkeleton() {
    return (
        <motion.div
            className="space-y-6"
        >
            {/* Welcome Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Welcome Message Card */}
                <motion.div
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Store className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="text-2xl font-bold">
                                        <Skeleton className="h-8 w-48" />
                                    </CardTitle>
                                    <CardDescription className="text-base mt-1">
                                        <Skeleton className="h-5 w-40" />
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Description skeleton */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>

                            {/* Feature grid skeleton */}
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <motion.div
                                    className="flex items-center gap-3 p-3 bg-background/50 rounded-lg"
                                    initial={{ y: 10 }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                    <div className="flex-1">
                                        <Skeleton className="h-4 w-12 mb-1" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="flex items-center gap-3 p-3 bg-background/50 rounded-lg"
                                    initial={{ y: 10 }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Package className="h-5 w-5 text-blue-600" />
                                    <div className="flex-1">
                                        <Skeleton className="h-4 w-16 mb-1" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="flex items-center gap-3 p-3 bg-background/50 rounded-lg"
                                    initial={{ y: 10 }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Users className="h-5 w-5 text-purple-600" />
                                    <div className="flex-1">
                                        <Skeleton className="h-4 w-12 mb-1" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="flex items-center gap-3 p-3 bg-background/50 rounded-lg"
                                    initial={{ y: 10 }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Sparkles className="h-5 w-5 text-orange-600" />
                                    <div className="flex-1">
                                        <Skeleton className="h-4 w-16 mb-1" />
                                        <Skeleton className="h-3 w-28" />
                                    </div>
                                </motion.div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Quick Actions Bar Skeleton */}
                <motion.div
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Skeleton className="h-5 w-5 rounded" />
                                <Skeleton className="h-6 w-32" />
                            </CardTitle>
                            <CardDescription>
                                <Skeleton className="h-4 w-48" />
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Quick action buttons skeleton */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[...Array(4)].map((_, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ y: 10 }}
                                        animate={{ y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                                            <Skeleton className="h-8 w-8 rounded" />
                                            <div className="flex-1">
                                                <Skeleton className="h-4 w-24 mb-1" />
                                                <Skeleton className="h-3 w-32" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Additional actions skeleton */}
                            <div className="pt-4 border-t">
                                <div className="grid grid-cols-2 gap-3">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default OverviewSkeleton 