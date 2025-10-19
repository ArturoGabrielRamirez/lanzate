import { Store } from "lucide-react"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Suspense } from "react"

import { StoreListContainer, StoreListSkeleton } from "@/features/dashboard/components"
import { Title } from "@/features/layout/components"
import { PageContainer } from "@/features/layout/components/page-container"

export const metadata: Metadata = {
    title: "Stores",
    description: "Stores"
}

async function StoresPage() {
    const t = await getTranslations("store")

    return (
        <PageContainer>
            <Title title={<div className="flex items-center gap-2">
                <Store />
                {t("title")}
            </div>} breadcrumbs={[
                {
                    label: t("title"),
                    href: "/stores"
                }
            ]} showDate />

            <Suspense fallback={<StoreListSkeleton />}>
                <StoreListContainer />
            </Suspense>
        </PageContainer>
    )
}

export default StoresPage