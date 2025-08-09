import { Card, CardHeader, CardTitle } from "@/components/ui/card"

type SalesOverviewProps = {
    slug: string
}

export default function SalesOverview({ slug }: SalesOverviewProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sales Overview Analytics</CardTitle>
            </CardHeader>
        </Card>
    )
} 