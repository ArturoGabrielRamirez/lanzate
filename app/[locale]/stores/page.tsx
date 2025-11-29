import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Suspense } from "react"

import { HelpCard, PageHeader, StoreListContainer, StoreListSkeleton, WelcomeTutorial } from "@/features/dashboard/components"
import { getUserInfo } from "@/features/global/actions"
import { PageContainer } from "@/features/layout/components/page-container"
import { redirect } from "@/i18n/naviation"

export const metadata: Metadata = {
    title: "Stores",
    description: "Stores"
}

async function StoresPage() {
    const t = await getTranslations("store")

    const { payload: user } = await getUserInfo()

    if (!user) return redirect({ href: "/login", locale: "es" })

    return (
        <PageContainer className="gap-4 flex flex-col lg:gap-8">
            <PageHeader
                title={t("title")}
                breadcrumbs={[
                    { label: t("title"), href: "/stores" }
                ]}
            />
            <div className="hidden lg:grid lg:grid-cols-[1fr_2fr] lg:gap-8">
                <div className="flex flex-col gap-8">
                    <HelpCard />
                    <WelcomeTutorial userId={user.id} />
                </div>
                <div className="flex flex-col gap-8">
                    <Suspense fallback={<StoreListSkeleton />}>
                        <StoreListContainer storeCount={10} mandatoryAddMore />
                    </Suspense>
                </div>
            </div>
        </PageContainer>
    )
}

export default StoresPage