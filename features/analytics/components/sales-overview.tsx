import { Card, CardHeader, CardTitle } from "@/components/ui/card"

type SalesOverviewProps = {
    slug: string
    userId: string
}

export default function SalesOverview({ slug, userId }: SalesOverviewProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sales Overview Analytics</CardTitle>
            </CardHeader>
        </Card>
    )
} 