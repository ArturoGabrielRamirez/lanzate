import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import TableSkeleton from "@/features/stores/components/tabs/table-skeleton"
import { TabPageProps } from "@/features/stores/types"
import { lazy, Suspense } from "react"

async function TabPage({ params }: TabPageProps) {

    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.error(userMessage)
    }

    const { tab, slug } = await params
    const LazyComponent = lazy(() => import(`@/features/stores/components/tabs/${tab}`))

    return (
        <Suspense fallback={<TableSkeleton />}>
            <LazyComponent slug={slug} userId={user.id} />
        </Suspense>
    )
}
export default TabPage