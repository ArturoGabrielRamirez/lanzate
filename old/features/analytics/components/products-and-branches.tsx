import { Card, CardHeader, CardTitle } from "@/components/ui/card"

type ProductsAndBranchesProps = {
    slug: string
}

export default function ProductsAndBranches({ slug }: ProductsAndBranchesProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Products and Branches Analytics</CardTitle>
            </CardHeader>
        </Card>
    )
} 