import { Product } from "@prisma/client"

import { GridCard } from "@/features/products/components/grid-card"
import { ListCard } from "@/features/products/components/list-card"
import { ProductCardContainer } from "@/features/products/components/product-card-container"

function ProductsCard({ product, href }: { product: Product; href: string }) {
    return (
        <ProductCardContainer
            listCard={<ListCard product={product} href={href} />}
            gridCard={<GridCard product={product} href={href} />}
        />
    )
}

export { ProductsCard }