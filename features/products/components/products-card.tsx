import { Product } from "@prisma/client"

import { GridCard } from "@/features/products/components/grid-card"
import { ListCard } from "@/features/products/components/list-card"
import { ProductCardContainer } from "@/features/products/components/product-card-container"

type Props = {
    product: Product
    href: string
}

function ProductsCard({ product, href }: Props) {
    return (
        <ProductCardContainer
            listCard={<ListCard product={product} href={href} />}
            gridCard={<GridCard product={product} href={href} />}
        />
    )
}

export { ProductsCard }