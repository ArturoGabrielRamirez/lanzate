"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Product } from "@prisma/client"
import Image from "next/image"
import { useStore } from "./store-provider"
import AddToCartButton from "./add-to-cart-button"
import Link from "next/link"

type Props = {
    product: Product
}

function ProductCard({ product }: Props) {

    const { displayType } = useStore()

    if (displayType === "list") {
        return (
            <Link href={`/item/${product.id}`} className="flex flex-row gap-2 w-full h-fit" >
                <Card className="flex flex-row gap-2 w-full">
                    <CardHeader className="grid grid-cols-[max-content_1fr] gap-2 w-full grid-rows-1">
                        <div className="relative h-full grow max-w-40 aspect-square w-full">
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
                        <div>
                            <CardTitle className="text-lg font-bold">{product.name}</CardTitle>
                            <CardDescription className="line-clamp-2 h-11">{product.description || "No description available for this product"}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardFooter className="flex justify-between items-center flex-col">
                        <p className="text-xl font-bold">${product.price}</p>
                        <AddToCartButton product={product} />
                    </CardFooter>
                </Card >
            </Link>
        )
    }


    return (
        <Link href={`/item/${product.id}`}>
            <Card className="aspect-9/12 bg-accent hover:scale-105 transition-all cursor-pointer object-cover w-full h-fit gap-2">
                <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2 h-11">{product.description || "No description available for this product"}</CardDescription>
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
                    <AddToCartButton product={product} />
                </CardFooter>
            </Card>
        </Link>
    )
}
export default ProductCard