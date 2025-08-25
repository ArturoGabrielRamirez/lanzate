import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Product } from "@prisma/client"
import Image from "next/image"
import AddToCartButton from "./add-to-cart-button"
import Link from "next/link"
import LikeButton from "./like-button"

type Props = {
    product: Product
}

function ListCard({ product }: Props) {
    return (
        <Link href={`/item/${product.id}`} className="block w-full">
            <Card className="flex flex-row gap-3 p-3 h-24 hover:shadow-md transition-shadow">
                <div className="relative h-16 w-16 flex-shrink-0">
                    {product.image ? (
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="rounded-md object-cover"
                        />
                    ) : (
                        <img 
                            src="https://api.dicebear.com/9.x/icons/svg?seed=boxes" 
                            alt="Product Image" 
                            className="rounded-md w-full h-full object-cover" 
                        />
                    )}
                </div>
                <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                        <CardTitle className="text-base font-semibold truncate mb-1">
                            {product.name}
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground line-clamp-2 leading-tight">
                            {product.description || "No description available for this product"}
                        </CardDescription>
                    </div>
                </div>
                <div className="flex flex-col justify-between items-end flex-shrink-0">
                    <p className="text-lg font-bold">${product.price}</p>
                    <div className="flex gap-1">
                        <AddToCartButton product={product} canBeAddedToCart={true} />
                        {/* <LikeButton productId={product.id} /> */}
                    </div>
                </div>
            </Card>
        </Link>
    )
}

export default ListCard