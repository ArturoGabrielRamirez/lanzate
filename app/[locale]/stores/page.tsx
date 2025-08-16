import { Title } from "@/features/layout/components"
import { StoresContainer, StoresSkeleton } from "@/features/stores/components"
import { Store } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Suspense } from "react"

async function StoresPage() {
    const t = await getTranslations("store")

    return (
        <div className="p-2 md:p-4 pt-13 md:pt-24 max-md:pb-12 container mx-auto z-10">
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
        </div>
    )
}

export default StoresPage