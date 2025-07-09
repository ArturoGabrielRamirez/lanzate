type Props = {
    params: Promise<{ slug: string, id: string }>
}

async function ProductDetailPage({ params }: Props) {

    const { slug, id } = await params

    return (
        <div>ProductDetailPage</div>
    )
}
export default ProductDetailPage