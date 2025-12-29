/* import Image from "next/image" */
import Link from "next/link"

import { AddToCartButton } from "@/features/products/components/add-to-cart-button"
import type { ListCardProps } from "@/features/products/types"
import { Card, CardDescription, CardTitle } from "@/features/shadcn/components/ui/card"

function ListCard({ product, href }: ListCardProps) {
    return (
        <Link href={href} className="block w-full">
            <Card className="flex flex-row gap-3 p-3 h-24 hover:shadow-md transition-shadow">
                <div className="relative h-16 w-16 flex-shrink-0">
                    {/* {product.image ? (
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="rounded-md object-cover"
                        />
                    ) : (
                        <Image
                            src="https://api.dicebear.com/9.x/icons/svg?seed=boxes"
                            alt="Product Image"
                            className="rounded-md w-full h-full object-cover"
                            fill
                        />
                    )} */}
                </div>
                <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                        <CardTitle className="text-base font-semibold truncate mb-1">
                            {product.name}
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground line-clamp-2 leading-tight">
                            {product.description || "No hay descripción disponible para este producto"}
                        </CardDescription>
                    </div>
                </div>
                <div className="flex flex-col justify-between items-end flex-shrink-0">
                   {/*  <p className="text-lg font-bold">${product.price}</p> */}
                    <div className="flex gap-1">
                        <AddToCartButton product={product} canBeAddedToCart={true} />
                        {/* <LikeButton productId={product.id} /> */}
                    </div>
                </div>
            </Card>
        </Link>
    )
}

export { ListCard }