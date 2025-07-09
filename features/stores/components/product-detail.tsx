type Props = {
    productId: string
}

async function ProductDetail({ productId }: Props) {

    await new Promise(resolve => setTimeout(resolve, 2000))

    return (
        <div>Product Detail</div>
    )
}
export default ProductDetail