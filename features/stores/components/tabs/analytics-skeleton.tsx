import { DollarSign, ShoppingCart, TrendingUp, Package, Store, Eye, Activity, Crown } from "lucide-react"
import * as motion from "motion/react-client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function AnalyticsSkeleton() {
    return (
        <motion.div className="space-y-6">
            {/* First Row - Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="flex flex-col gap-6">
                    {/* Product Store Count Widget */}
                    <motion.div>
                        <Card className="hover:bg-accent transition-colors duration-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="flex items-center gap-2">
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                    <CardTitle className="text-sm md:text-base font-medium">
                                        <Skeleton className="h-5 w-32" />
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Top Row */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col items-center">
                                            <Package className="size-4 md:size-5 lg:size-7 text-blue-500" />
                                            <div className="flex flex-col items-center">
                                                <Skeleton className="h-8 w-12" />
                                                <Skeleton className="h-3 w-20 mt-1" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <Store className="size-4 md:size-5 lg:size-7 text-green-500" />
                                            <div className="flex flex-col items-center">
                                                <Skeleton className="h-8 w-8" />
                                                <Skeleton className="h-3 w-16 mt-1" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Bottom Row */}
                                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                                        <div className="flex flex-col items-center">
                                            <Activity className="size-4 md:size-5 lg:size-7 text-emerald-500" />
                                            <div className="flex flex-col items-center">
                                                <Skeleton className="h-5 w-8" />
                                                <Skeleton className="h-3 w-12 mt-1" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <Eye className="size-4 md:size-5 lg:size-7 text-purple-500" />
                                            <div className="flex flex-col items-center">
                                                <Skeleton className="h-5 w-8" />
                                                <Skeleton className="h-3 w-16 mt-1" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Top Products Widget */}
                    <motion.div>
                        <Card className="grow hover:bg-accent transition-colors duration-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="flex items-center gap-2">
                                    <Crown className="h-4 w-4 text-muted-foreground" />
                                    <CardTitle className="text-sm md:text-base font-medium">
                                        <Skeleton className="h-5 w-28" />
                                    </CardTitle>
                                </div>
                                <Skeleton className="h-4 w-16" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <motion.div 
                                            key={index}
                                            className="flex items-center space-x-3"
                                        >
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>
                                                    <Skeleton className="h-8 w-8 rounded-full" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <Skeleton className="h-4 w-24" />
                                                <Skeleton className="h-3 w-16 mt-1" />
                                            </div>
                                            <div className="text-right">
                                                <Skeleton className="h-4 w-16" />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Right Column - Sales by Month Chart */}
                <motion.div className="lg:col-span-1">
                    <Card className="hover:bg-accent transition-colors duration-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                <CardTitle className="text-sm md:text-base font-medium">
                                    <Skeleton className="h-5 w-36" />
                                </CardTitle>
                            </div>
                            <Skeleton className="h-4 w-16" />
                        </CardHeader>
                        <CardContent>
                            {/* Chart Skeleton */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end space-x-2 h-40">
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                                            <div className="flex space-x-1">
                                                <Skeleton 
                                                    className="w-4 bg-blue-200" 
                                                    style={{ 
                                                        height: `${Math.random() * 80 + 40}px` 
                                                    }} 
                                                />
                                                <Skeleton 
                                                    className="w-4 bg-orange-200" 
                                                    style={{ 
                                                        height: `${Math.random() * 60 + 30}px` 
                                                    }} 
                                                />
                                            </div>
                                            <Skeleton className="h-3 w-8" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Second Row - Sales Overview Widget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div>
                    <Card className="hover:bg-accent transition-colors duration-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <CardTitle className="text-sm md:text-base font-medium">
                                    <Skeleton className="h-5 w-32" />
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Total Revenue */}
                                <div>
                                    <Skeleton className="h-8 w-32" />
                                    <Skeleton className="h-3 w-24 mt-1" />
                                </div>

                                {/* Orders and Average */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <Skeleton className="h-5 w-8" />
                                            <Skeleton className="h-3 w-12 mt-1" />
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <Skeleton className="h-5 w-16" />
                                            <Skeleton className="h-3 w-16 mt-1" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                
                {/* Empty space for second column */}
                <div></div>
            </div>
        </motion.div>
    )
}

export { AnalyticsSkeleton }