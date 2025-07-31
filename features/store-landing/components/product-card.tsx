import { Product } from "@prisma/client"
import ProductCardContainer from "./product-card-container"
import GridCard from "./grid-card"
import ListCard from "./list-card"

type Props = {
    product: Product
}

function ProductCard({ product }: Props) {
    return (
        <ProductCardContainer
            listCard={<ListCard product={product} />}
            gridCard={<GridCard product={product} />}
        />
    )
}

export default ProductCard