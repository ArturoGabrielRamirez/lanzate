import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Suspense, lazy } from "react"

import { getUserInfo } from "@/features/global/actions/get-user-info.action"
import { Card, CardContent, CardHeader , CardTitle } from "@/features/shadcn/components/ui/card"

type Props = {
    params: Promise<{ slug: string, id: string }>
}

async function AnalyticsOptionContainer({ params }: Props) {
    const { slug, id } = await params

    const { payload: user, hasError: userError, message: userMessage } = await getUserInfo()

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
                            Estadísticas - No encontradas
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
                    Estadísticas
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Suspense fallback={<div>Cargando estadísticas...</div>}>
                    <LazyComponent slug={slug} />
                </Suspense>
            </CardContent>
        </Card>
    )
}

export default AnalyticsOptionContainer