import { TabPageProps } from "@/features/stores/types"
import { lazy, Suspense } from "react"

async function TabPage({ params }: TabPageProps) {

    const { tab, slug } = await params
    const LazyComponent = lazy(() => import(`@/features/stores/components/tabs/${tab}`))

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LazyComponent slug={slug} />
        </Suspense>
    )
}
export default TabPage