import { getUserStoreCount } from "@/features/dashboard/data/getUserStoreCount"
import { Button } from "@/components/ui/button"
import { Calendar, Store } from "lucide-react"
import Link from "next/link"
import { Zap } from "lucide-react"
import QuickActionsClient from "@/features/dashboard/components/quick-actions-client"

type QuickActionsProps = {
    userId: number
}

async function QuickActions({ userId }: QuickActionsProps) {

    const { payload: storeCount, error: storeCountError, message: storeCountMessage } = await getUserStoreCount(userId)

    if (storeCountError || storeCount === undefined) {
        console.error(storeCountMessage)
        return null
    }

    const hasStores = storeCount > 0

    return (
        <div className="area-[actions] hidden md:block" id="step3">
            <div className="md:flex items-center justify-between mb-2 md:mb-4 hidden">
                <h2 className="text-lg lg:text-2xl font-bold leading-6 flex items-center gap-2 text-muted-foreground/50">
                    <Zap className="size-4 xl:size-5" />
                    Quick Actions
                </h2>
            </div>
            <div className="flex items-center gap-2">
                {hasStores ? (
                    <Button  className="grow" size="icon" asChild>
                        <Link href="/sale">
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M21 15h-2.5a1.503 1.503 0 0 0-1.5 1.5a1.503 1.503 0 0 0 1.5 1.5h1a1.503 1.503 0 0 1 1.5 1.5a1.503 1.503 0 0 1-1.5 1.5H17m2 0v1m0-8v1m-6 6H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2m12 3.12V9a2 2 0 0 0-2-2h-2"></path><path d="M16 10V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v6m8 0H8m8 0h1m-9 0H7m1 4v.01M8 17v.01m4-3.02V14m0 3v.01"></path></g></svg>
                        </Link>
                    </Button>
                ) : (
                    <QuickActionsClient userId={userId} />
                )}
                <Button  className="grow" size="icon" asChild>
                    <Link href="/stores">
                        <Store className="size-4" />
                    </Link>
                </Button>
                <Button  className="grow md:hidden" size="icon">
                    <Calendar className="size-4" />
                </Button>
            </div>
        </div>
    )
}

export default QuickActions 