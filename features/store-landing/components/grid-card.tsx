import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Product } from "@prisma/client"
import Image from "next/image"
import AddToCartButton from "./add-to-cart-button"
import Link from "next/link"
import LikeButton from "./like-button"
type Props = {
    product: Product
}

function GridCard({ product }: Props) {
    return (
        <Link href={`/item/${product.id}`}>
            <Card className="aspect-9/12 bg-[var(--product-card-background)] text-[var(--product-card-text)] hover:scale-105 transition-all cursor-pointer object-cover w-full h-fit gap-2">
                <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                        {product.description || "No description available for this product"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="grow">
                    <div className="relative h-full">
                        {product.image ? (
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="rounded-md object-cover"
                            />
                        ) : (
                            <img src="https://api.dicebear.com/9.x/icons/svg?seed=boxes" alt="Product Image" className="rounded-md" />
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <p>${product.price}</p>
                    <div className="flex gap-2">
                        <AddToCartButton product={product} />
                        <LikeButton productId={product.id} />
                    </div>
                </CardFooter>
            </Card>
        </Link>
    )
}

export default GridCard 