import { Card, CardHeader, CardTitle } from "@/components/ui/card"

type SalesByMonthProps = {
    slug: string
}

export default function SalesByMonth({ slug }: SalesByMonthProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sales by Month Analytics</CardTitle>
            </CardHeader>
        </Card>
    )
} 