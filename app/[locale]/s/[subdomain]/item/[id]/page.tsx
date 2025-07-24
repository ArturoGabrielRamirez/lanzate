import { Title } from "@/features/layout/components"

type Props = {
    params: Promise<{ id: string }>
}

async function ProductDetailsPage({ params }: Props) {

    const { id } = await params

    return (
        <section className="p-4">
            <Title
                title="Product Details"
                breadcrumbs={[{ label: "Product Details", href: `/item/${id}` }]}
            />
        </section>
    )
}
export default ProductDetailsPage