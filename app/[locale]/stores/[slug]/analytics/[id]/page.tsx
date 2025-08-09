import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Suspense, lazy } from "react"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"

type Props = {
    params: Promise<{ slug: string, id: string }>
}

const AnalyticsOptionContainer = async ({ params }: Props) => {
    const { slug, id } = await params

    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.error(userMessage)
    }


    // Map analytics IDs to component names
    const analyticsComponents: Record<string, string> = {
        'products-and-branches': 'products-and-branches',
        'top-products': 'top-products',
        'sales-overview': 'sales-overview',
        'sales-by-month': 'sales-by-month'
    }

    const componentName = analyticsComponents[id]

    if (!componentName) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Link href={`/stores/${slug}/analytics`}>
                            <ArrowLeft className="size-4" />
                        </Link>
                        Analytics - Not Found
                    </CardTitle>
                </CardHeader>
            </Card>
        )
    }

    const LazyComponent = lazy(() => import(`@/features/analytics/components/${id}.tsx`))

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Link href={`/stores/${slug}/analytics`}>
                        <ArrowLeft className="size-4" />
                    </Link>
                    Analytics
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Suspense fallback={<div>Loading analytics...</div>}>
                    <LazyComponent slug={slug} />
                </Suspense>
            </CardContent>
        </Card>
    )
}

export default AnalyticsOptionContainer