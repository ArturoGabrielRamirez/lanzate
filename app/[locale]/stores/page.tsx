import { Title } from "@/features/layout/components"
import { StoresContainer, StoresSkeleton } from "@/features/stores/components"
import { getTranslations } from "next-intl/server"
import { Suspense } from "react"

async function StoresPage() {
    const t = await getTranslations("store")

    return (
        <div className="p-4 pt-17 max-md:pb-12">
            <Title title={t("title")} breadcrumbs={[
                {
                    label: t("title"),
                    href: "/stores"
                }
            ]} showDate/>
            
            <Suspense fallback={<StoresSkeleton />}>
                <StoresContainer />
            </Suspense>
        </div>
    )
}

export default StoresPage