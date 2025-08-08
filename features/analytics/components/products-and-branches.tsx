import { Card, CardHeader, CardTitle } from "@/components/ui/card"

type ProductsAndBranchesProps = {
    slug: string
    userId: string
}

export default function ProductsAndBranches({ slug, userId }: ProductsAndBranchesProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Products and Branches Analytics</CardTitle>
            </CardHeader>
        </Card>
    )
} 