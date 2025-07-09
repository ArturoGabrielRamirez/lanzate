import { lazy, Suspense } from "react"

type Props = {
    params: Promise<{ slug: string, tab: string }>
}


async function TabPage({ params }: Props) {

    const { tab, slug } = await params
    const LazyComponent = lazy(() => import(`@/features/stores/components/tabs/${tab}`))

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LazyComponent slug={slug} />
        </Suspense>
    )
}
export default TabPage