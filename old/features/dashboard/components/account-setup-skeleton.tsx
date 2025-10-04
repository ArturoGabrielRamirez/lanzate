import { Loader, Settings } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

const AccountSetupSkeleton = () => {
    return (
        <div className="area-[setup] hidden lg:block group/setup">
            <div className="flex items-center justify-between mb-2 md:mb-4">
                <h2 className="text-lg lg:text-2xl font-bold leading-6 flex items-center gap-2 text-primary/50 group-hover/setup:text-primary transition-all">
                    <Settings className="size-4 xl:size-5" />
                    Account Setup
                </h2>
            </div>
            <Card className="!gap-2">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <p>Account Setup</p>
                        <p className="text-muted-foreground/50">step 1 of 4</p>
                    </CardTitle>
                    <Progress className="w-full" />
                </CardHeader>
                <CardContent>
                    <ul className="flex flex-col gap-2">
                        <li className="flex items-center gap-2">
                            <Loader className="size-4 animate-spin"/>
                            <Skeleton className="w-full h-5" />
                        </li>
                        <li className="flex items-center gap-2">
                            <Loader className="size-4 animate-spin"/>
                            <Skeleton className="w-full h-5" />
                        </li>
                        <li className="flex items-center gap-2">
                            <Loader className="size-4 animate-spin"/>
                            <Skeleton className="w-full h-5" />
                        </li>
                        <li className="flex items-center gap-2">
                            <Loader className="size-4 animate-spin"/>
                            <Skeleton className="w-full h-5" />
                        </li>
                    </ul>
                </CardContent>
                <CardFooter>
                    <Skeleton className="w-full h-10" />
                </CardFooter>
            </Card>
        </div>
    )
}
export default AccountSetupSkeleton