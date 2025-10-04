import { Title } from "@/features/layout/components"
import PageContainer from "@/features/layout/components/page-container"
import { StoresContainer, StoresSkeleton } from "@/features/stores/components"
import { Store } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Suspense } from "react"

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

            <Suspense fallback={<StoresSkeleton />}>
                <StoresContainer />
            </Suspense>
        </PageContainer>
    )
}

export default StoresPage