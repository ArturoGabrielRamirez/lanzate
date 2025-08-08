import { Card, CardHeader, CardTitle } from "@/components/ui/card"

type TopProductsProps = {
    slug: string
    userId: string
}

export default function TopProducts({ slug, userId }: TopProductsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Products Analytics</CardTitle>
            </CardHeader>
        </Card>
    )
} 