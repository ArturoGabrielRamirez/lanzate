import { ShoppingBasket } from "lucide-react"
import { Title } from "@/features/layout/components"
import { StoreSelectorContainer, StoreSelectorSkeleton } from "@/features/sale/components"
import { getTranslations } from "next-intl/server"
import { Suspense } from "react"

async function SalePage() {
    const t = await getTranslations("sale")

    return (
        <section className="p-2 md:p-4 flex flex-col pt-13 md:pt-17">
            <Title title={(
                <div className="flex items-center gap-2">
                    <ShoppingBasket />
                    {t("title")}
                </div>
            )} breadcrumbs={[{
                label: t("breadcrumbs.sale"),
                href: "/sale"
            }]} showDate/>

            <div className="flex-1 flex items-center justify-center min-h-[400px]">
                <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 w-full max-w-md">
                    <Suspense fallback={<StoreSelectorSkeleton />}>
                        <StoreSelectorContainer />
                    </Suspense>
                </div>
            </div>
        </section>
    )
}

export default SalePage