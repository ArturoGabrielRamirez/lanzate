import { Metadata } from "next"
import { Suspense } from "react"

import { WelcomeTutorial, WelcomeWidget, DashboardError, ActivityFeed, ActivityFeedSkeleton, HelpCard, StoreListContainer, StoreListSkeleton, TestStoreCreator } from "@/features/dashboard/components"
import { loadFeedParams } from "@/features/dashboard/utils"
import { getUserInfo } from "@/features/global/actions"
import { GlobalSearch } from "@/features/global-search/components"
import { PageContainer } from "@/features/layout/components"
import { SectionContainer } from "@/features/stores/components"
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
        <PageContainer className="gap-4 flex flex-col lg:gap-8">
            <WelcomeWidget user={user} />
            <div className="lg:hidden flex flex-col gap-4">
                <Suspense>
                    <SectionContainer title="Looking for something?">
                        <GlobalSearch userId={user.id} />
                    </SectionContainer>
                </Suspense>
                <Suspense fallback={<StoreListSkeleton />}>
                    <StoreListContainer />
                </Suspense>
                <TestStoreCreator userId={user.id} />
                <Suspense fallback={<ActivityFeedSkeleton />} key={type}>
                    <ActivityFeed userId={user.id} type={type} page={page || 1} />
                </Suspense>
                <HelpCard />
            </div>
            <div className="hidden lg:grid lg:grid-cols-[1fr_2fr] lg:gap-8">
                <div className="flex flex-col gap-8">
                    {/* <Suspense>
                        <SectionContainer title="Looking for something?">
                            <GlobalSearch userId={user.id} />
                        </SectionContainer>
                    </Suspense> */}
                    <Suspense fallback={<StoreListSkeleton />}>
                        <StoreListContainer />
                    </Suspense>
                    <HelpCard />
                    <WelcomeTutorial userId={user.id} />
                </div>
                <div className="flex flex-col gap-4">
                    <TestStoreCreator userId={user.id} />
                    <Suspense fallback={<ActivityFeedSkeleton />} key={type}>
                        <ActivityFeed userId={user.id} type={type} page={page || 1} />
                    </Suspense>
                </div>
            </div>
        </PageContainer>
    )
}