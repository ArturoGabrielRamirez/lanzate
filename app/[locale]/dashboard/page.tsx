import { Metadata } from "next"
import { Suspense } from "react"

import { WelcomeTutorial } from "@/features/dashboard/components"
import { WelcomeWidget } from "@/features/dashboard/components"
import { DashboardError } from "@/features/dashboard/components"
import { ActivityFeed, ActivityFeedSkeleton } from "@/features/dashboard/components"
import { HelpCard } from "@/features/dashboard/components"
import { StoreListContainer } from "@/features/dashboard/components/store-list"
import { StoreListSkeleton } from "@/features/dashboard/components/store-list"
import { loadFeedParams } from "@/features/dashboard/utils/load-feed-params"
import { GlobalSearch } from "@/features/global-search/components"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { PageContainer } from "@/features/layout/components"
import { redirect } from "@/i18n/naviation"

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Dashboard",
}


export default async function Dashboard({ searchParams }: { searchParams: Promise<{ type: string }> }) {

    const { type, page } = await loadFeedParams(searchParams)

    const { payload: user, hasError, message } = await getUserInfo()

    if (!user) return redirect({ href: "/login", locale: "es" })

    if (hasError) {
        return (
            <PageContainer>
                <DashboardError message={message} />
            </PageContainer>
        )
    }

    return (
        <PageContainer className="gap-4 flex flex-col">
            <WelcomeWidget user={user} />
            <WelcomeTutorial />
            <Suspense>
                <GlobalSearch userId={user.id} />
            </Suspense>
            <Suspense fallback={<StoreListSkeleton />}>
                <StoreListContainer />
            </Suspense>
            <Suspense fallback={<ActivityFeedSkeleton />} key={type}>
                <ActivityFeed userId={user.id} type={type} page={page || 1} />
            </Suspense>
            <HelpCard />
        </PageContainer>
    )
}