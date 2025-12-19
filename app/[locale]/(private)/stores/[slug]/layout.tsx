import { Suspense } from "react"

import { HelpCard } from "@/features/dashboard/components"
import { getUserInfo } from "@/features/global/actions"
import { PageContainer } from "@/features/layout/components"
import { getStoreBasicsBySlugAction } from "@/features/stores/actions"
import { SectionContainer, StoreHeaderServer, StoreHeaderSkeleton/* , StoreHeaderTinyWidgets */, StoreNavigation } from "@/features/stores/components"
import { StoreDetailsLayoutProps } from "@/features/stores/types"
import { redirect } from "@/i18n/naviation"


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {

    const { slug } = await params

    const { payload: store, hasError: storeError } = await getStoreBasicsBySlugAction(slug)

    if (storeError || !store) {
        return {
            title: "Tienda no encontrada"
        }
    }

    return {
        title: store.name
    }
}


async function StoreDetailsLayout({ children, params }: StoreDetailsLayoutProps) {

    const { slug } = await params

    const { payload: user, hasError: userError } = await getUserInfo()

    if (!user) return redirect({ href: "/login", locale: "es" })

    if (userError) {
        return null
    }

    const { payload: store, hasError: storeError } = await getStoreBasicsBySlugAction(slug)

    if (storeError) {
        return null
    }

    if (!store) {
        return redirect({ href: "/stores", locale: "es" })
    }

    return (
        <PageContainer className="gap-4">
            <Suspense fallback={<StoreHeaderSkeleton />}>
                <StoreHeaderServer slug={slug} />
            </Suspense>
            <div className="grow">
                <div className="lg:hidden flex flex-col gap-4">
                    {children}
                </div>
                <div className="hidden lg:grid lg:grid-cols-[1fr_2fr] lg:gap-8">
                    <div className="flex flex-col gap-8 sticky top-24">
                        <SectionContainer title="Tus atajos" className="@container">
                            <StoreNavigation slug={slug} />
                        </SectionContainer>
                        {/* <SectionContainer title="Tu resumen">
                            <StoreHeaderTinyWidgets slug={slug} />
                        </SectionContainer> */}
                        <HelpCard />
                    </div>
                    {children}
                </div>
            </div>
        </PageContainer>
    )
}
export default StoreDetailsLayout