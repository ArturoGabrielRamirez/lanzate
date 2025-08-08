import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

type Props = {
    params: Promise<{ slug: string, id: string }>
}

const AnalyticsOptionContainer = async ({ params }: Props) => {

    const { slug, id } = await params

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
        </Card>
    )
}
export default AnalyticsOptionContainer