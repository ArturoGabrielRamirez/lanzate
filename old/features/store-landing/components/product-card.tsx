import { Product } from "@prisma/client"
import ProductCardContainer from "./product-card-container"
import GridCard from "./grid-card"
import ListCard from "./list-card"

type Props = {
    product: Product
    href: string
}

function ProductCard({ product, href }: Props) {
    return (
        <ProductCardContainer
            listCard={<ListCard product={product} href={href} />}
            gridCard={<GridCard product={product} href={href} />}
        />
    )
}

export default ProductCard