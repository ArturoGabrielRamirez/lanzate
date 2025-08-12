import { Button } from "@/components/ui/button"
import FloatingDock from "@/features/header/components/floating-dock"
import { Home, User } from "lucide-react"
import { Calendar } from "lucide-react"
import { Title } from "@/features/layout/components"
import { StoresContainer, StoresSkeleton } from "@/features/stores/components"
import { Store } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { Suspense } from "react"

async function StoresPage() {
    const t = await getTranslations("store")

    return (
        <div className="p-2 md:p-4 pt-13 md:pt-17 max-md:pb-12">
            <Title title={t("title")} breadcrumbs={[
                {
                    label: t("title"),
                    href: "/stores"
                }
            ]} showDate />

            <Suspense fallback={<StoresSkeleton />}>
                <StoresContainer />
            </Suspense>
            {/* <FloatingDock showBackButton /> */}
        </div>
    )
}

export default StoresPage